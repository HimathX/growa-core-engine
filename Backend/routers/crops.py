from fastapi import APIRouter, HTTPException, status
from fastapi.responses import JSONResponse
from datetime import date, datetime, timedelta
from typing import List, Dict, Any, Optional
import logging
from schemas import CreateCropRequest, CropCreationResponse, CropTasksResponse , TaskMilestone, TaskStatus, TaskStatusUpdate , CropCategory
from utils import TaskGenerator , ProgressCalculator
from core import crop_collection, crop_tasks_collection
from bson import ObjectId

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(tags=["Crop Management"])

# Initialize utilities
task_generator = TaskGenerator()

@router.post("/", response_model=CropCreationResponse)
async def create_crop(request: CreateCropRequest):
    try:
        # Validate planting date
        today = date.today()
        if request.planting_date < today - timedelta(days=365):
            raise HTTPException(
                status_code=400,
                detail="Planting date cannot be more than 1 year in the past"
            )
        
        if request.planting_date > today + timedelta(days=365):
            raise HTTPException(
                status_code=400,
                detail="Planting date cannot be more than 1 year in the future"
            )
        
        # Create crop document directly from request
        crop_doc = {
            "name": request.name,
            "crop_type": request.crop_category.value,
            "planting_date": request.planting_date.isoformat(),
            "plant_count": request.plant_count,
            "location": request.location.value,
            "area_size": request.area_size,
            "user_id": request.user_id,
            "status": "Active",
            "progress_percentage": 0.0,
            "current_phase": "Planning",
        }
        
        # Insert crop into MongoDB
        crop_result = crop_collection.insert_one(crop_doc)
        crop_id = str(crop_result.inserted_id)
        
        # Generate tasks using the request data
        tasks = task_generator.generate_tasks_from_request(request, crop_id)
        
        # Store tasks in MongoDB
        task_docs = []
        for task in tasks:
            task_dict = task.dict(by_alias=True)
            task_dict["scheduled_start_date"] = task.scheduled_start_date.isoformat()
            task_dict["scheduled_end_date"] = task.scheduled_end_date.isoformat()
            task_docs.append(task_dict)
        
        if task_docs:
            crop_tasks_collection.insert_many(task_docs)
            logger.info(f"Generated {len(task_docs)} tasks for crop {crop_id}")
        
        # Calculate initial progress
        progress, current_phase = ProgressCalculator.calculate_progress_from_request(request, tasks)
        
        # Calculate estimated harvest date
        estimated_harvest_date = None
        if tasks:
            max_days = max(t.days_from_planting + t.duration_days for t in tasks)
            estimated_harvest_date = request.planting_date + timedelta(days=max_days)
        
        # Update crop with progress and harvest date
        crop_collection.update_one(
            {"_id": ObjectId(crop_id)},
            {
                "$set": {
                    "progress_percentage": progress,
                    "current_phase": current_phase,
                    "estimated_harvest_date": estimated_harvest_date.isoformat() if estimated_harvest_date else None
                }
            }
        )
        
        # Get upcoming tasks (next 7 days)
        upcoming_tasks = []
        for task in tasks:
            if task.scheduled_start_date <= today + timedelta(days=7) and task.status == TaskStatus.PENDING:
                upcoming_tasks.append({
                    "id": task.id,
                    "name": task.task_name,
                    "type": task.task_type,
                    "scheduled_start_date": task.scheduled_start_date,
                    "days_from_now": (task.scheduled_start_date - today).days
                })
        
        upcoming_tasks.sort(key=lambda x: x["scheduled_start_date"])
        
        # Create summary
        total_tasks = len(tasks)
        summary = {
            "total_tasks": total_tasks,
            "completed_tasks": 0,
            "pending_tasks": total_tasks,
            "days_since_planting": (today - request.planting_date).days,
            "plant_density": request.plant_count / request.area_size if request.area_size > 0 else 0
        }
        
        # Create response crop object
        response_crop = {
            "id": crop_id,
            "name": request.name,
            "crop_type": request.crop_category.value,
            "planting_date": request.planting_date,
            "plant_count": request.plant_count,
            "location": request.location.value,
            "area_size": request.area_size,
            "user_id": request.user_id,
            "status": "Active",
            "progress_percentage": progress,
            "current_phase": current_phase,
            "estimated_harvest_date": estimated_harvest_date
        }
        
        logger.info(f"Crop creation completed. Progress: {progress}%, Phase: {current_phase}")
        
        return CropCreationResponse(
            success=True,
            message=f"Crop '{request.name}' created successfully with {len(tasks)} task milestones",
            crop=response_crop,
            milestones_created=len(tasks),
            initial_progress=round(progress, 1),
            current_phase=current_phase,
            estimated_harvest_date=estimated_harvest_date,
            upcoming_tasks=upcoming_tasks[:5],
            summary=summary
        )
        
    except Exception as e:
        logger.error(f"Error creating crop: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create crop: {str(e)}"
        )

@router.get("/{crop_id}/tasks", response_model=CropTasksResponse)
async def get_crop_tasks(crop_id: str):
    try:
        # Validate crop_id
        if not ObjectId.is_valid(crop_id):
            raise HTTPException(status_code=400, detail="Invalid crop ID format")
        
        # Get crop details
        crop = crop_collection.find_one({"_id": ObjectId(crop_id)})
        if not crop:
            raise HTTPException(status_code=404, detail="Crop not found")
        
        # Get all task milestones for this crop
        task_docs = list(crop_tasks_collection.find({"crop_tracking_id": crop_id}))
        
        # Convert to TaskMilestone objects
        tasks = []
        for doc in task_docs:
            # Convert date strings back to date objects
            doc["scheduled_start_date"] = datetime.fromisoformat(doc["scheduled_start_date"]).date()
            doc["scheduled_end_date"] = datetime.fromisoformat(doc["scheduled_end_date"]).date()

            task = TaskMilestone(**doc)
            tasks.append(task)
        
        # Calculate task statistics
        total_tasks = len(tasks)
        completed_tasks = len([t for t in tasks if t.status == TaskStatus.COMPLETED])
        pending_tasks = len([t for t in tasks if t.status == TaskStatus.PENDING])
        overdue_tasks = len([t for t in tasks if t.status == TaskStatus.OVERDUE])
        
        # Sort tasks by scheduled start date
        tasks.sort(key=lambda x: x.scheduled_start_date)
        
        return CropTasksResponse(
            crop_id=crop_id,
            crop_name=crop["name"],
            planting_date=datetime.fromisoformat(crop["planting_date"]).date(),
            tasks=tasks,
            total_tasks=total_tasks,
            completed_tasks=completed_tasks,
            pending_tasks=pending_tasks,
            overdue_tasks=overdue_tasks
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get crop tasks: {str(e)}"
        )

@router.put("/{crop_id}/tasks/{task_id}/status", response_model=Dict[str, Any])
async def update_task_status(crop_id: str, task_id: str, status_update: TaskStatusUpdate):
    """Update the status of a specific task for a crop"""
    try:
        logger.info(f"Attempting to update task {task_id} for crop {crop_id}")
        
        # Validate crop_id (this should be ObjectId)
        if not ObjectId.is_valid(crop_id):
            raise HTTPException(status_code=400, detail="Invalid crop ID format")
        
        # Find task first (using string ID)
        task_doc = crop_tasks_collection.find_one({"_id": task_id})  # Changed: removed ObjectId conversion
        if not task_doc:
            logger.error(f"Task not found: {task_id}")
            raise HTTPException(status_code=404, detail="Task milestone not found")
        
        # Verify task belongs to crop
        if task_doc.get("crop_tracking_id") != crop_id:
            logger.error(f"Task {task_id} does not belong to crop {crop_id}")
            raise HTTPException(
                status_code=400,
                detail="Task does not belong to the specified crop"
            )
        
        # Find crop
        crop = crop_collection.find_one({"_id": ObjectId(crop_id)})
        if not crop:
            logger.error(f"Crop not found: {crop_id}")
            raise HTTPException(status_code=404, detail="Crop not found")
        
        # Prepare update data
        now = datetime.now()
        update_data = {
            "status": status_update.status.value,
            "updated_at": now.isoformat()
        }
        
        # Handle status-specific updates
        if status_update.status == TaskStatus.COMPLETED:
            update_data["completed_date"] = now.isoformat()
        elif status_update.status == TaskStatus.IN_PROGRESS:
            update_data["completed_date"] = None  # type: ignore
        
        # Update the task (using string ID)
        result = crop_tasks_collection.find_one_and_update(
            {"_id": task_id},  # Changed: removed ObjectId conversion
            {"$set": update_data},
            return_document=True
        )
        
        if not result:
            raise HTTPException(status_code=400, detail="Failed to update task status")
        
        # Convert dates in result
        result["scheduled_start_date"] = datetime.fromisoformat(result["scheduled_start_date"]).date()
        result["scheduled_end_date"] = datetime.fromisoformat(result["scheduled_end_date"]).date()
        if result.get("completed_date"):
            result["completed_date"] = datetime.fromisoformat(result["completed_date"])
        
        # Recalculate crop progress
        all_tasks = list(crop_tasks_collection.find({"crop_tracking_id": crop_id}))
        task_milestones = []
        
        for doc in all_tasks:
            doc["scheduled_start_date"] = datetime.fromisoformat(doc["scheduled_start_date"]).date()
            doc["scheduled_end_date"] = datetime.fromisoformat(doc["scheduled_end_date"]).date()
            task_milestones.append(TaskMilestone(**doc))
        
        # Calculate new progress and phase
        request = CreateCropRequest(
            name=crop["name"],
            crop_category=CropCategory(crop["crop_type"]),
            planting_date=datetime.fromisoformat(crop["planting_date"]).date(),
            plant_count=crop["plant_count"],
            location=crop["location"],
            area_size=crop["area_size"],
            user_id=crop["user_id"]
        )
        
        progress, current_phase = ProgressCalculator.calculate_progress_from_request(request, task_milestones)
        
        # Update crop with new progress
        crop_collection.update_one(
            {"_id": ObjectId(crop_id)},
            {
                "$set": {
                    "progress_percentage": progress,
                    "current_phase": current_phase,
                    "updated_at": now.isoformat()
                }
            }
        )
        
        # Calculate task statistics
        total_tasks = len(task_milestones)
        completed_tasks = len([t for t in task_milestones if t.status == TaskStatus.COMPLETED])
        pending_tasks = len([t for t in task_milestones if t.status == TaskStatus.PENDING])
        overdue_tasks = len([t for t in task_milestones if t.status == TaskStatus.OVERDUE])
        
        return {
            "success": True,
            "message": f"Task status updated to {status_update.status.value}",
            "task": result,
            "crop_progress": round(progress, 1),
            "current_phase": current_phase,
            "task_statistics": {
                "total_tasks": total_tasks,
                "completed_tasks": completed_tasks,
                "pending_tasks": pending_tasks,
                "overdue_tasks": overdue_tasks,
                "completion_percentage": round((completed_tasks / total_tasks) * 100 if total_tasks > 0 else 0, 1)
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating task status: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to update task status: {str(e)}"
        )

@router.get("/{crop_id}")
async def get_crop_details(crop_id: str):
    """Get detailed information about a specific crop"""
    try:
        if not ObjectId.is_valid(crop_id):
            raise HTTPException(status_code=400, detail="Invalid crop ID format")
        
        crop = crop_collection.find_one({"_id": ObjectId(crop_id)})
        if not crop:
            raise HTTPException(status_code=404, detail="Crop not found")
        
        # Convert ObjectId to string and dates
        crop["_id"] = str(crop["_id"])
        if crop.get("planting_date"):
            crop["planting_date"] = datetime.fromisoformat(crop["planting_date"]).date().isoformat()
        if crop.get("estimated_harvest_date"):
            crop["estimated_harvest_date"] = datetime.fromisoformat(crop["estimated_harvest_date"]).date().isoformat()
        
        # Get task count
        task_count = crop_tasks_collection.count_documents({"crop_tracking_id": crop_id})
        crop["task_count"] = task_count
        
        return crop
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get crop details: {str(e)}"
        )

@router.get("/user/{user_id}")
async def get_user_crops(user_id: str):
    """Get all crops for a specific user"""
    try:
        crops = list(crop_collection.find({"user_id": user_id}))
        
        # Convert ObjectIds and dates
        for crop in crops:
            crop["_id"] = str(crop["_id"])
            if crop.get("planting_date"):
                crop["planting_date"] = datetime.fromisoformat(crop["planting_date"]).date().isoformat()
            if crop.get("estimated_harvest_date"):
                crop["estimated_harvest_date"] = datetime.fromisoformat(crop["estimated_harvest_date"]).date().isoformat()
        
        return {
            "crops": crops,
            "total_count": len(crops)
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get user crops: {str(e)}"
        )