from enum import Enum
from datetime import date, timedelta
from typing import List, Optional
from pydantic import BaseModel, Field, validator
from bson import ObjectId
from typing import Dict, Any

class WeeklyPricePrediction(BaseModel):
    week_number: int
    date_start: str
    date_end: str
    predicted_price: float
    confidence_lower: float
    confidence_upper: float
    price_change_percent: float
    market_factors: Dict[str, float]
    weather_impact: Dict[str, float]

class MarketSummary(BaseModel):
    total_change_percent: float
    maximum_price: float
    minimum_price: float
    average_price: float
    volatility_score: float
    market_demand_level: str  # Changed from float to str
    export_potential_percent: float
    price_trend: str  # Changed from float to str
    max_weekly_change: float
    weeks_analyzed: int

class CropPriceResponse(BaseModel):
    crop_name: str
    current_price: float
    weekly_predictions: List[WeeklyPricePrediction]

class MarketAnalysis(BaseModel):
    high_growth_crops: List[Dict[str, Any]]
    volatile_crops: List[Dict[str, Any]]
    best_plants_to_grow: List[Dict[str, Any]]
    seasonal_insights: Dict[str, List[str]]
    recommendations: List[str]

class CropMarketAnalysis(BaseModel):
    crop_name: str
    current_market_position: str
    price_trend: str
    volatility_assessment: str
    seasonal_pattern: Dict[str, float]
    competitive_analysis: Dict[str, Any]
    growth_potential: str
    risk_factors: List[str]
    opportunities: List[str]
    recommendations: List[str]