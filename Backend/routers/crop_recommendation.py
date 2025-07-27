from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from schemas import CropPredictionRequest, PredictionResponse
from utils.crop_recommendation_utils import prediction_service
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1", tags=["Crop Prediction"])

@router.post("/predict-crops", response_model=PredictionResponse)
async def predict_crops(request: CropPredictionRequest):
    """
    Get crop recommendations based on farming conditions
    
    This endpoint analyzes your farming conditions and provides personalized
    crop recommendations with predicted scores, ROI estimates, and growing details.
    """
    try:
        logger.info(f"Received prediction request for district: {request.district}")
        
        # Validate request
        if not request.district.strip():
            raise HTTPException(
                status_code=400, 
                detail="District name cannot be empty"
            )
        
        # Get predictions
        result = prediction_service.predict(request)
        
        if not result.success:
            logger.warning(f"No recommendations found: {result.message}")
            return JSONResponse(
                status_code=404,
                content=result.dict()
            )
        
        logger.info(f"Successfully generated {result.total_recommendations} recommendations")
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in predict_crops: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )