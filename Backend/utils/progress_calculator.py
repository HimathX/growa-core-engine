from datetime import date
from typing import List, Tuple
from schemas.crops import CreateCropRequest
from schemas.tasks import TaskMilestone, TaskStatus

class ProgressCalculator:
    
    @staticmethod
    def calculate_progress_from_request(request: CreateCropRequest, milestones: List[TaskMilestone]) -> Tuple[float, str]:
        """Calculate overall progress percentage and current phase from CreateCropRequest"""
        if not milestones:
            return 0.0, "Planning"
        
        today = date.today()
        days_since_planting = (today - request.planting_date).days
        
        # Time-based progress (40% weight)
        time_progress = ProgressCalculator._calculate_time_progress(milestones, days_since_planting)
        
        # Task completion progress (60% weight)
        task_progress = ProgressCalculator._calculate_task_progress(milestones)
        
        # Weighted average
        overall_progress = (time_progress * 0.4) + (task_progress * 0.6)
        
        # Determine current phase
        current_phase = ProgressCalculator._determine_current_phase(milestones, days_since_planting)
        
        return min(overall_progress, 100.0), current_phase
    
    @staticmethod
    def _calculate_time_progress(milestones: List[TaskMilestone], days_since_planting: int) -> float:
        """Calculate progress based on time elapsed"""
        if not milestones:
            return 0.0
        
        # Find the latest milestone end date
        max_days = max(m.days_from_planting + m.duration_days for m in milestones)
        
        if max_days <= 0:
            return 100.0
        
        return min((days_since_planting / max_days) * 100, 100.0)
    
    @staticmethod
    def _calculate_task_progress(milestones: List[TaskMilestone]) -> float:
        """Calculate progress based on completed tasks"""
        if not milestones:
            return 0.0
        
        total_tasks = len(milestones)
        completed_tasks = len([m for m in milestones if m.status == TaskStatus.COMPLETED])
        
        return (completed_tasks / total_tasks) * 100
    
    @staticmethod
    def _determine_current_phase(milestones: List[TaskMilestone], days_since_planting: int) -> str:
        """Determine the current growth phase"""
        # Find active milestones
        active_milestones = [
            m for m in milestones 
            if m.days_from_planting <= days_since_planting <= (m.days_from_planting + m.duration_days)
        ]
        
        if active_milestones:
            # Group by task type and return the most common
            task_types = [m.task_type for m in active_milestones]
            most_common_type = max(set(task_types), key=task_types.count)
            return most_common_type.replace("_", " ").title()
        
        # If no active milestones, find the most recent completed phase
        past_milestones = [
            m for m in milestones 
            if (m.days_from_planting + m.duration_days) < days_since_planting
        ]
        
        if past_milestones:
            latest_milestone = max(past_milestones, key=lambda x: x.days_from_planting + x.duration_days)
            return latest_milestone.task_type.replace("_", " ").title()
        
        return "Planning Phase"