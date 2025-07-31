from enum import Enum
from datetime import date, timedelta
from typing import List, Optional
from pydantic import BaseModel, Field, validator
from bson import ObjectId


class TaskStatus(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    SKIPPED = "skipped"
    OVERDUE = "overdue"

class Task(BaseModel):
    name: str = Field(..., description="Name of the task")
    type: str = Field(..., description="Type of task (e.g., irrigation, fertilization)")
    description: str = Field(..., description="Detailed description of the task")
    frequency: str = Field(..., description="Frequency at which the task should be performed (e.g., daily, weekly)")
    days_from_planting: int = Field(..., description="Number of days from planting when the task should occur")
    duration_days: int = Field(..., description="Duration in days for which the task is expected to last")

class TaskMilestone(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()), alias="_id", description="Unique identifier for the task milestone")
    crop_tracking_id: str = Field(..., description="ID of the crop tracking record")
    task_name: str = Field(..., description="Name of the task milestone")
    task_type: str = Field(..., description="Type of task (e.g., irrigation, fertilization)")
    description: str = Field(..., description="Detailed description of the task milestone")
    frequency: str = Field(..., description="Frequency at which the task should be performed")
    days_from_planting: int = Field(..., description="Number of days from planting when the task should occur")
    duration_days: int = Field(..., description="Duration in days for which the task is expected to last")
    scheduled_start_date: date = Field(..., description="Scheduled start date for the task")
    scheduled_end_date: date = Field(..., description="Scheduled end date for the task")
    status: TaskStatus = Field(default=TaskStatus.PENDING, description="Current status of the task milestone")

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class TaskStatusUpdate(BaseModel):
    status: TaskStatus