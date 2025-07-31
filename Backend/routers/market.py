from fastapi import HTTPException, Query , APIRouter
from typing import  Optional
from enum import Enum
from datetime import datetime, timedelta
from schemas import CropType, WeeklyPricePrediction, CropPriceResponse, MarketSummary, MarketAnalysis, CropMarketAnalysis
from utils import get_micro_farming_recommendations , get_economic_indicators , enhanced_price_prediction ,load_enhanced_crop_patterns , get_weather_data

router = APIRouter(tags=["Market"])

ENHANCED_CROP_PATTERNS = load_enhanced_crop_patterns()

@router.get("/prices/{crop_name}", response_model=CropPriceResponse)
async def get_crop_prices(
    crop_name: CropType,
    weeks: int = Query(default=12, ge=1, le=44, description="Number of weeks to predict (1-44)"),
    location: str = Query(default="Colombo", description="Location in Sri Lanka"),
    custom_price: Optional[float] = Query(default=None, description="Custom current price override")
):
    """Get comprehensive price predictions for a specific crop (1-44 weeks)"""
    
    try:
        # Fetch real-time data
        weather_data = await get_weather_data(location)
        economic_data = await get_economic_indicators()
        
        # Get base price
        pattern = ENHANCED_CROP_PATTERNS.get(crop_name.value.upper())
        if not pattern:
            raise HTTPException(status_code=404, detail=f"Crop {crop_name.value} not found in database")
        
        current_price = custom_price if custom_price else pattern["base_price_lkr"]
        
        # Generate predictions
        weekly_predictions = enhanced_price_prediction(
            crop_name.value, current_price, weather_data, economic_data, weeks
        )
        
        # Calculate market summary
        final_price = weekly_predictions[-1].predicted_price
        max_price = max(pred.predicted_price for pred in weekly_predictions)
        min_price = min(pred.predicted_price for pred in weekly_predictions)
        avg_price = sum(pred.predicted_price for pred in weekly_predictions) / len(weekly_predictions)
        
        # Calculate additional metrics
        price_trend = "increasing" if final_price > current_price else "decreasing"
        max_change = max(abs(pred.price_change_percent) for pred in weekly_predictions)
        
        market_summary = MarketSummary(
            total_change_percent=round(((final_price - current_price) / current_price) * 100, 2),
            maximum_price=round(max_price, 2),
            minimum_price=round(min_price, 2),
            average_price=round(avg_price, 2),
            volatility_score=round(pattern["volatility"] * 100, 1),
            market_demand_level=pattern["market_demand"],
            export_potential_percent=round(pattern["export_ratio"] * 100, 1),
            price_trend=price_trend,
            max_weekly_change=round(max_change, 2),
            weeks_analyzed=weeks
        )
        
        return CropPriceResponse(
            crop_name=crop_name.value,
            current_price=current_price,
            weekly_predictions=weekly_predictions
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating predictions: {str(e)}")

@router.get("/market/analysis", response_model=MarketAnalysis)
async def get_whole_market_analysis():
    """Comprehensive analysis of the entire micro farming market"""
    
    try:
        # Fetch economic data
        economic_data = await get_economic_indicators()
        weather_data = await get_weather_data("Colombo")
        
        # Analyze all crops
        crop_analyses = []
        high_growth_crops = []
        volatile_crops = []
        
        for crop_name, pattern in ENHANCED_CROP_PATTERNS.items():
            # Simulate 3-month prediction for trend analysis
            predictions = enhanced_price_prediction(
                crop_name, pattern["base_price_lkr"], weather_data, economic_data, 12
            )
            
            final_price = predictions[-1].predicted_price
            total_change = ((final_price - pattern["base_price_lkr"]) / pattern["base_price_lkr"]) * 100
            avg_weekly_change = sum(abs(p.price_change_percent) for p in predictions) / len(predictions)
            
            crop_analysis = {
                "crop_name": crop_name,
                "current_price": pattern["base_price_lkr"],
                "predicted_change": total_change,
                "volatility": pattern["volatility"],
                "market_demand": pattern["market_demand"],
                "export_ratio": pattern["export_ratio"],
                "avg_weekly_volatility": avg_weekly_change
            }
            
            crop_analyses.append(crop_analysis)
            
            if total_change > 8:
                high_growth_crops.append(crop_analysis)
            
            if pattern["volatility"] > 0.35:
                volatile_crops.append(crop_analysis)
        
        # Calculate market trends
        avg_price_change = sum(c["predicted_change"] for c in crop_analyses) / len(crop_analyses)
        avg_volatility = sum(c["volatility"] for c in crop_analyses) / len(crop_analyses)
        positive_trends = len([c for c in crop_analyses if c["predicted_change"] > 0])
        
        # Seasonal insights
        current_month = datetime.now().month
        seasonal_insights = {
            "peak_season_crops": [c["crop_name"] for c in crop_analyses if c["predicted_change"] > 5],
            "off_season_opportunities": [c["crop_name"] for c in crop_analyses if c["predicted_change"] < -2],
            "stable_crops": [c["crop_name"] for c in crop_analyses if abs(c["predicted_change"]) < 3],
            "current_month_favorable": [
                crop for crop, pattern in ENHANCED_CROP_PATTERNS.items() 
                if current_month in pattern["seasonal_peak"]
            ]
        }
        
        # Economic impact assessment
        market_sentiment_score = 1.0 if avg_price_change > 3 else 0.5 if avg_price_change > -2 else 0.0
        economic_impact = {
            "exchange_rate_effect": round((economic_data["usd_lkr_rate"] - 300) / 300 * 100, 2),
            "fuel_cost_impact": round(economic_data["fuel_cost_impact"] * 100, 2),
            "inflation_pressure": economic_data["inflation_estimate"],
            "market_sentiment_score": market_sentiment_score,
            "growth_crops_percentage": round((len(high_growth_crops) / len(crop_analyses)) * 100, 1),
            "volatile_crops_percentage": round((len(volatile_crops) / len(crop_analyses)) * 100, 1)
        }
        
        # Calculate best plants to grow (top 3 based on multiple factors)
        best_plants_scores = []
        for analysis in crop_analyses:
            # Calculate comprehensive score based on multiple factors
            growth_score = max(0, analysis["predicted_change"] / 20)  # Normalize to 0-1
            demand_score = {"low": 0.2, "medium": 0.5, "high": 0.8, "very_high": 0.9, "extreme": 1.0}.get(analysis["market_demand"], 0.5)
            export_score = analysis["export_ratio"]
            stability_score = 1 - analysis["volatility"]  # Lower volatility = higher stability
            
            # Weighted comprehensive score
            comprehensive_score = (
                growth_score * 0.3 +
                demand_score * 0.25 +
                export_score * 0.25 +
                stability_score * 0.2
            )
            
            best_plants_scores.append({
                "crop_name": analysis["crop_name"],
                "current_price": analysis["current_price"],
                "predicted_change": round(analysis["predicted_change"], 2),
                "market_demand": analysis["market_demand"],
                "export_potential": round(analysis["export_ratio"] * 100, 1),
                "volatility_score": round(analysis["volatility"] * 100, 1),
                "comprehensive_score": round(comprehensive_score * 100, 1),
                "growth_score": round(growth_score * 100, 1),
                "demand_score": round(demand_score * 100, 1),
                "export_score": round(export_score * 100, 1),
                "stability_score": round(stability_score * 100, 1)
            })
        
        # Sort by comprehensive score and get top 3
        best_plants_to_grow = sorted(best_plants_scores, key=lambda x: x["comprehensive_score"], reverse=True)[:3]
        
        # Generate comprehensive recommendations
        recommendations = []
        if avg_price_change > 5:
            recommendations.append("Market shows strong growth potential - consider expanding production capacity")
        if economic_data["usd_lkr_rate"] > 320:
            recommendations.append("High exchange rates favor export-oriented crops like spices and medicinal plants")
        if economic_impact["fuel_cost_impact"] > 5:
            recommendations.append("Focus on crops with shorter supply chains due to elevated transport costs")
        if len(high_growth_crops) > 10:
            recommendations.append("Diversify portfolio with high-growth crops but maintain risk balance")
        if economic_impact["volatile_crops_percentage"] > 40:
            recommendations.append("Implement hedging strategies for volatile crop investments")
        
        # Seasonal recommendations
        if current_month in [12, 1, 2]:
            recommendations.append("Cool season crops (lettuce, spinach, broccoli) show optimal growing conditions")
        elif current_month in [6, 7, 8, 9]:
            recommendations.append("Monsoon season favors mushrooms and certain leafy greens")
        
        # Get AI-powered micro farming recommendations
        top_crop_names = [crop["crop_name"] for crop in best_plants_to_grow]
        micro_farming_recommendations = await get_micro_farming_recommendations(
            economic_data, weather_data, top_crop_names
        )
        
        return MarketAnalysis(
            high_growth_crops=sorted(high_growth_crops, key=lambda x: x["predicted_change"], reverse=True)[:5],
            volatile_crops=sorted(volatile_crops, key=lambda x: x["volatility"], reverse=True)[:5],
            best_plants_to_grow=best_plants_to_grow[:5],
            seasonal_insights=seasonal_insights,
            recommendations=micro_farming_recommendations
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating market analysis: {str(e)}")

@router.get("/market/crop/{crop_name}", response_model=CropMarketAnalysis)
async def get_crop_market_analysis(crop_name: CropType):
    """Detailed market analysis for a specific crop"""
    
    try:
        # Get crop pattern
        pattern = ENHANCED_CROP_PATTERNS.get(crop_name.value.upper())
        if not pattern:
            raise HTTPException(status_code=404, detail=f"Crop {crop_name.value} not found")
        
        # Fetch real-time data
        weather_data = await get_weather_data("Colombo")
        economic_data = await get_economic_indicators()
        
        # Generate predictions for analysis
        predictions = enhanced_price_prediction(
            crop_name.value, pattern["base_price_lkr"], weather_data, economic_data, 12
        )
        
        final_price = predictions[-1].predicted_price
        total_change = ((final_price - pattern["base_price_lkr"]) / pattern["base_price_lkr"]) * 100
        avg_weekly_change = sum(abs(p.price_change_percent) for p in predictions) / len(predictions)
        
        # Market position assessment
        if pattern["base_price_lkr"] > 10000:
            market_position = "premium_luxury"
        elif pattern["base_price_lkr"] > 1000:
            market_position = "high_value"
        elif pattern["base_price_lkr"] > 300:
            market_position = "mid_range"
        else:
            market_position = "commodity"
        
        # Price trend assessment
        if total_change > 15:
            price_trend = "strongly_increasing"
        elif total_change > 5:
            price_trend = "increasing"
        elif total_change > -5:
            price_trend = "stable"
        elif total_change > -15:
            price_trend = "decreasing"
        else:
            price_trend = "strongly_decreasing"
        
        # Volatility assessment
        if pattern["volatility"] > 0.4:
            volatility_assessment = "high_risk_high_reward"
        elif pattern["volatility"] > 0.3:
            volatility_assessment = "moderate_risk"
        else:
            volatility_assessment = "stable_low_risk"
        
        # Seasonal pattern analysis
        seasonal_pattern = {}
        for month in range(1, 13):
            if month in pattern["seasonal_peak"]:
                seasonal_pattern[f"month_{month}"] = 1.15  # 15% above average
            elif month in [6, 7, 8, 9]:  # Monsoon
                if crop_name.value in ["OYSTER_MUSHROOM", "SHIITAKE"]:
                    seasonal_pattern[f"month_{month}"] = 1.08
                else:
                    seasonal_pattern[f"month_{month}"] = 0.92
            else:
                seasonal_pattern[f"month_{month}"] = 1.0
        
        # Competitive analysis
        similar_crops = []
        for other_crop, other_pattern in ENHANCED_CROP_PATTERNS.items():
            if (abs(other_pattern["base_price_lkr"] - pattern["base_price_lkr"]) < pattern["base_price_lkr"] * 0.3 
                and other_crop != crop_name.value):
                similar_crops.append({
                    "crop": other_crop,
                    "price": other_pattern["base_price_lkr"],
                    "demand": other_pattern["market_demand"]
                })
        
        competitive_analysis = {
            "market_category": market_position,
            "direct_competitors": similar_crops[:5],
            "competitive_advantage": "export_potential" if pattern["export_ratio"] > 0.5 else "local_demand",
            "market_share_potential": "high" if pattern["market_demand"] in ["high", "very_high", "extreme"] else "medium"
        }
        
        # Growth potential assessment
        growth_factors = []
        if pattern["export_ratio"] > 0.5:
            growth_factors.append("strong_export_market")
        if pattern["market_demand"] in ["high", "very_high", "extreme"]:
            growth_factors.append("high_local_demand")
        if total_change > 10:
            growth_factors.append("positive_price_trend")
        if pattern["weather_sensitivity"] < 0.6:
            growth_factors.append("climate_resilient")
        
        if len(growth_factors) >= 3:
            growth_potential = "excellent"
        elif len(growth_factors) >= 2:
            growth_potential = "good"
        elif len(growth_factors) >= 1:
            growth_potential = "moderate"
        else:
            growth_potential = "limited"
        
        # Risk factors identification
        risk_factors = []
        if pattern["volatility"] > 0.4:
            risk_factors.append("High price volatility due to market fluctuations")
        if pattern["weather_sensitivity"] > 0.7:
            risk_factors.append("Vulnerable to adverse weather conditions")
        if pattern["export_ratio"] > 0.6 and economic_data["usd_lkr_rate"] < 300:
            risk_factors.append("Exchange rate dependency for export markets")
        if total_change < -10:
            risk_factors.append("Declining price trend observed")
        if len(similar_crops) > 5:
            risk_factors.append("High competition in market segment")
        if crop_name.value in ["STRAWBERRY", "LETTUCE", "BROCCOLI"]:
            risk_factors.append("Climate sensitivity limits growing seasons")
        
        # Opportunities identification
        opportunities = []
        if pattern["export_ratio"] > 0.3:
            opportunities.append("Export market expansion potential")
        if pattern["market_demand"] == "medium" and total_change > 5:
            opportunities.append("Growing local market demand")
        if crop_name.value in ["MORINGA", "ASHWAGANDHA", "ALOE_VERA"]:
            opportunities.append("Rising health consciousness creates premium market")
        if pattern["base_price_lkr"] > 1000:
            opportunities.append("Value-added processing opportunities")
        if pattern["weather_sensitivity"] < 0.5:
            opportunities.append("Climate change resilience advantage")
        opportunities.append("Organic certification premium potential")
        
        # Generate specific recommendations
        recommendations = []
        if growth_potential == "excellent":
            recommendations.append("Strong investment candidate - consider scaling production")
        if pattern["volatility"] > 0.35:
            recommendations.append("Implement forward contracts or price hedging strategies")
        if pattern["export_ratio"] > 0.5:
            recommendations.append("Focus on quality standards for export market access")
        if crop_name.value in ["VANILLA", "SAFFRON", "CARDAMOM"]:
            recommendations.append("Premium positioning and direct-to-consumer marketing")
        if pattern["weather_sensitivity"] > 0.7:
            recommendations.append("Invest in protected cultivation techniques")
        recommendations.append("Diversify with complementary crops to manage risk")
        recommendations.append("Monitor market trends for optimal harvest timing")
        
        return CropMarketAnalysis(
            crop_name=crop_name.value,
            current_market_position=market_position,
            price_trend=price_trend,
            volatility_assessment=volatility_assessment,
            seasonal_pattern=seasonal_pattern,
            competitive_analysis=competitive_analysis,
            growth_potential=growth_potential,
            risk_factors=risk_factors,
            opportunities=opportunities,
            recommendations=recommendations
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating crop analysis: {str(e)}")


@router.get("/weather/{location}")
async def get_weather_info(location: str = "Colombo"):
    """Get current weather information for a location"""
    try:
        weather_data = await get_weather_data(location)
        return {
            "location": location,
            "weather_data": weather_data,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching weather data: {str(e)}")

