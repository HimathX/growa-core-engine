from fastapi import APIRouter, UploadFile, File, HTTPException, status
from utils.pest_detection import predict_plant
from typing import Dict, Any

router = APIRouter(tags=["Pest Detection"])

@router.post("/predict", status_code=status.HTTP_200_OK)
async def predict_pest(file: UploadFile = File(...)) -> Dict[str, Any]:
    """
    Predict plant disease from uploaded image
    
    - **file**: Image file to analyze
    
    Returns disease identification and remedy information
    """
    if not file.content_type.startswith('image/'): # type: ignore
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File provided is not an image"
        )
    
    try:
        contents = await file.read()
        result = predict_plant(contents)
        
        if result["status"] == "error":
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=result["remedy"]
            )
            
        return {
            "status": "success",
            "plant_disease": result["plant_disease"],
            "confidence": result["confidence"],
            "remedy": result["remedy"]
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=str(e)
        )

@router.get("/status")
async def pest_detector_status():
    """Check if pest detection service is running"""
    return {"status": "active", "service": "Pest Detection API"}