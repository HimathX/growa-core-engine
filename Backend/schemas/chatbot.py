from pydantic import BaseModel, Field
from typing import List
from datetime import datetime

class QuestionRequest(BaseModel):
    question: str = Field(..., description="The user's question to the chatbot.")
    user_id: str = Field(..., description="ID of the user asking the question, if available.")

class AnswerResponse(BaseModel):
    answer: str = Field(..., description="The chatbot's answer to the user's question.")

class ChatHistoryItem(BaseModel):
    user_id: str = Field(..., description="ID of the user who asked the question")
    question: str = Field(..., description="The question asked by the user")
    answer: str = Field(..., description="The answer provided by the chatbot")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="When the interaction occurred")

class ChatHistoryResponse(BaseModel):
    history: List[ChatHistoryItem] = Field(..., description="List of previous chat interactions")