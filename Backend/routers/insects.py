from fastapi import APIRouter, UploadFile, File, HTTPException, status
from fastapi.responses import JSONResponse
from typing import Dict, Any
from utils.insects_detection import predict_image, load_resources

router = APIRouter(tags=["Insect Detection"])

@router.on_event("startup")
async def startup_event():
    """Initialize insect detection resources"""
    try:
        load_resources()
        print("Insect detection resources loaded successfully")
    except Exception as e:
        print(f"Error loading insect detection resources: {str(e)}")

@router.post("/predict", status_code=status.HTTP_200_OK)
async def predict_insect(file: UploadFile = File(...)) -> Dict[str, Any]:
    """
    Predict insect class from uploaded image
    
    - **file**: Image file to analyze (max 10MB)
    
    Returns classification results with confidence scores
    """
    # Validate file type
    if not file.content_type.startswith('image/'): # type: ignore
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File provided is not an image"
        )
    
    try:
        # Read and validate file size (max 10MB)
        contents = await file.read()
        if len(contents) > 10 * 1024 * 1024:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail="File too large (max 10MB)"
            )
        
        # Make prediction
        result = predict_image(contents)
        return JSONResponse(content=result) # type: ignore
        
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction error: {str(e)}"
        )

@router.get("/status")
async def insect_detector_status():
    """Check if insect detection service is running"""
    return {
        "status": "active",
        "service": "Insect Detection API",
        "model_type": "VGG16 + SVM (fused features)"
    }