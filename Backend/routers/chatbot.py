from fastapi import APIRouter, HTTPException, Depends
from schemas import QuestionRequest, AnswerResponse, ChatHistoryItem, ChatHistoryResponse
from utils.vectorstore import VectorStore
from utils.gemini import generate_gemini_response
from core import chatbot_history_collection, user_collection
from datetime import datetime
from typing import Optional
from bson import ObjectId


router = APIRouter(tags=["chatbot"])

TOP_K_CHUNKS = 3

# Initialize with None
vector_store = None

def init_vector_store(store: VectorStore):
    """Initialize the vector store for the router"""
    global vector_store
    vector_store = store

def get_vector_store():
    """Dependency to get vector store instance"""
    if vector_store is None:
        raise HTTPException(500, "Vector store not initialized")
    return vector_store


@router.post("/ask-question/", response_model=AnswerResponse, summary="Ask agriculture question")
async def ask_question(
    request: QuestionRequest,
    vector_store: VectorStore = Depends(get_vector_store)
):
    """Get answers to Sri Lankan agriculture and farming questions"""
    if not vector_store:
        raise HTTPException(500, "Agriculture knowledge base failed to initialize")
    
    try:
        results = vector_store.search(request.question, TOP_K_CHUNKS)
        contexts = [chunk for chunk, _ in results]
        
        # Agriculture-specific system prompt
        system_prompt = """
        You are an agricultural assistant specializing in Sri Lankan farming practices and crops.
        Follow these rules strictly:
        1. Answer ONLY using information from the provided context about Sri Lankan agriculture
        2. If the answer isn't in the context, say "This information is not covered in my agriculture knowledge base"
        3. Focus on practical farming advice for Sri Lankan conditions
        4. Include information about suitable varieties, growing seasons, and local practices when available
        5. Mention agro-ecological zones (wet zone, dry zone, intermediate zone) when relevant
        6. Be clear, practical, and helpful for farmers
        7. Include micro-farming techniques when applicable for small-scale cultivation
        """
        
        answer = generate_gemini_response(
            system_prompt=system_prompt,
            context="\n\n---\n\n".join(contexts),
            user_query=request.question
        )

        # Store the question and answer in chat history if user_id is provided
        if request.user_id:
            chat_history_item = {
                "user_id": request.user_id,
                "question": request.question,
                "answer": answer,
                "timestamp": datetime.utcnow()
            }
            # Insert into database
            chatbot_history_collection.insert_one(chat_history_item)

        return AnswerResponse(answer=answer)
    except Exception as e:
        raise HTTPException(500, f"Question processing failed: {str(e)}")

# New endpoint to retrieve chat history for a user
@router.get("/chat-history/{user_id}", response_model=ChatHistoryResponse)
async def get_chat_history(user_id: str):
    """Get chat history for a specific user"""
    # Validate user_id format if it's ObjectId
    if not ObjectId.is_valid(user_id):
        raise HTTPException(400, "Invalid user ID format")
    
    # Retrieve chat history sorted by timestamp (newest first)
    history = list(chatbot_history_collection.find(
        {"user_id": user_id},
        {"_id": 0}  # Exclude MongoDB _id from results
    ).sort("timestamp", -1))
    
    return ChatHistoryResponse(history=history)

