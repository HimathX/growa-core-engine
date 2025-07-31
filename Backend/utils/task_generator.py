# utils/task_generator.py
import json
import os
from datetime import date, timedelta, datetime
from typing import List, Dict, Optional
from schemas import CreateCropRequest , TaskMilestone, TaskStatus

class TaskGenerator:
    def __init__(self):
        self.crop_tasks_db = self._load_crop_tasks_database()

    def _load_crop_tasks_database(self) -> Dict:
        """Load the crop tasks database"""
        try:
            db_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 
                                 "docs", "crop_tasks_database.json")
            with open(db_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading crop tasks database: {e}")
            return {}
    
    def generate_tasks_from_request(self, request: CreateCropRequest, crop_id: str) -> List[TaskMilestone]:
        """Generate all tasks for a crop based on CreateCropRequest"""
        crop_tasks_key = f"{request.crop_category.value}_TASKS"

        if crop_tasks_key not in self.crop_tasks_db:
            print(f"Warning: No tasks found for crop type: {request.crop_category}")
            return []

        tasks = self.crop_tasks_db[crop_tasks_key]

        if not tasks:
            print(f"Warning: Empty task list for crop type: {request.crop_category}")
            return []
        
        task_list = []
        for task in tasks:
            task_milestone = self._create_task_from_template(task, request, crop_id)
            task_list.append(task_milestone)
        
        return task_list
    
    def _create_task_from_template(self, task: Dict, request: CreateCropRequest, crop_id: str) -> TaskMilestone:
        """Create a task from a task template definition using CreateCropRequest"""
        # Calculate dates
        scheduled_start_date = request.planting_date + timedelta(days=task["days_from_planting"])
        scheduled_end_date = scheduled_start_date + timedelta(days=task["duration_days"])
        
        # Determine initial status
        today = date.today()
        if scheduled_start_date > today:
            status = TaskStatus.PENDING
        elif scheduled_start_date <= today <= scheduled_end_date:
            status = TaskStatus.IN_PROGRESS
        else: 
            status = TaskStatus.OVERDUE
        
        return TaskMilestone(
            crop_tracking_id=crop_id,
            task_name=task["name"],
            task_type=task["type"],
            description=task["description"],
            frequency=task["frequency"],
            days_from_planting=task["days_from_planting"],
            duration_days=task["duration_days"],
            scheduled_start_date=scheduled_start_date,
            scheduled_end_date=scheduled_end_date,
            status=status
        )