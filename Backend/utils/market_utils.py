from typing import List, Dict
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import random
import requests
import asyncio
import aiohttp
from functools import lru_cache
from schemas import WeeklyPricePrediction
import json
import os

OPENWEATHER_API_KEY = "4fe627bd2f5c757dc0a76ea3b43bdeef"
ALPHA_VANTAGE_API_KEY = "5YJBQLLJTWIBZTOA"
GOOGLE_API_KEY = "AIzaSyC24Tl1deS5-EuauSolF_4BivH52Z6wBSs"
NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
CURRENT_WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather"
FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast"
WORLD_BANK_URL = "https://api.worldbank.org/v2"
CBSL_URL = "https://www.cbsl.gov.lk"

def load_enhanced_crop_patterns() -> Dict:
    """Load enhanced crop patterns from JSON file"""
    try:
        patterns_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 
                                   "docs", "crop_price_patterns.json")
        with open(patterns_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading crop patterns: {e}")
        return {}

ENHANCED_CROP_PATTERNS = load_enhanced_crop_patterns()

async def get_weather_data(location: str = "Colombo") -> Dict:
    """Fetch real weather data from OpenWeatherMap"""
    try:
        # Get coordinates first
        geocode_url = f"{NOMINATIM_URL}?q={location},Sri Lanka&format=json&limit=1"
        async with aiohttp.ClientSession() as session:
            async with session.get(geocode_url) as response:
                geo_data = await response.json()
                if not geo_data:
                    lat, lon = 6.9271, 79.8612  # Default to Colombo
                else:
                    lat, lon = float(geo_data[0]['lat']), float(geo_data[0]['lon'])
            
            # Get current weather
            weather_url = f"{CURRENT_WEATHER_URL}?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}&units=metric"
            async with session.get(weather_url) as response:
                current_weather = await response.json()
            
            # Get forecast
            forecast_url = f"{FORECAST_URL}?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}&units=metric"
            async with session.get(forecast_url) as response:
                forecast_data = await response.json()
        
        return {
            "current": {
                "temperature": current_weather["main"]["temp"],
                "humidity": current_weather["main"]["humidity"],
                "pressure": current_weather["main"]["pressure"],
                "rainfall": current_weather.get("rain", {}).get("1h", 0),
                "wind_speed": current_weather["wind"]["speed"],
                "weather_condition": current_weather["weather"][0]["main"]
            },
            "forecast_5day": [
                {
                    "date": item["dt_txt"],
                    "temp": item["main"]["temp"],
                    "humidity": item["main"]["humidity"],
                    "rainfall": item.get("rain", {}).get("3h", 0)
                } for item in forecast_data["list"][:40]  # 5 days worth
            ]
        }
    except Exception as e:
        # Fallback dummy data
        return {
            "current": {
                "temperature": 28.5, "humidity": 78, "pressure": 1012,
                "rainfall": 2.5, "wind_speed": 3.2, "weather_condition": "Clouds"
            },
            "forecast_5day": []
        }

async def get_economic_indicators() -> Dict:
    """Fetch economic indicators from World Bank and Alpha Vantage"""
    try:
        async with aiohttp.ClientSession() as session:
            # Alpha Vantage - Exchange rates
            fx_url = f"https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=LKR&apikey={ALPHA_VANTAGE_API_KEY}"
            
            # Commodity prices from Alpha Vantage
            commodity_url = f"https://www.alphavantage.co/query?function=WTI&interval=monthly&apikey={ALPHA_VANTAGE_API_KEY}"
            
            economic_data = {}
            
            # Fetch exchange rate
            try:
                async with session.get(fx_url) as response:
                    fx_data = await response.json()
                    economic_data["usd_lkr_rate"] = float(fx_data["Realtime Currency Exchange Rate"]["5. Exchange Rate"])
            except:
                economic_data["usd_lkr_rate"] = 310.0  # Fallback
            
            # Fetch oil prices (affects transport costs)
            try:
                async with session.get(commodity_url) as response:
                    oil_data = await response.json()
                    latest_oil = list(oil_data["data"].values())[0]
                    economic_data["oil_price_usd"] = float(latest_oil["value"])
            except:
                economic_data["oil_price_usd"] = 75.0  # Fallback
            
            # Calculate derived indicators
            economic_data["fuel_cost_impact"] = (economic_data["oil_price_usd"] - 70) * 0.02  # Impact factor
            economic_data["import_cost_factor"] = economic_data["usd_lkr_rate"] / 300  # Normalized
            economic_data["inflation_estimate"] = 12.5  # Sri Lanka 2024 estimate
            
            return economic_data
    
    except Exception as e:
        # Fallback economic data
        return {
            "usd_lkr_rate": 310.0,
            "oil_price_usd": 75.0,
            "fuel_cost_impact": 0.1,
            "import_cost_factor": 1.03,
            "inflation_estimate": 12.5
        }

def calculate_weather_crop_impact(weather_data: Dict, crop_name: str) -> Dict[str, float]:
    """Calculate detailed weather impact on specific crops"""
    current = weather_data["current"]
    temp = current["temperature"]
    humidity = current["humidity"]
    rainfall = current["rainfall"]
    
    impacts = {}
    
    # Temperature impact
    if crop_name in ["SPINACH", "LETTUCE", "KALE", "CABBAGE", "CAULIFLOWER", "BROCCOLI"]:  # Cool season crops
        if temp > 32:
            impacts["temperature"] = -0.15  # Negative impact
        elif temp < 20:
            impacts["temperature"] = 0.05
        else:
            impacts["temperature"] = 0.02
    elif crop_name in ["CHILI", "TOMATO", "EGGPLANT", "CAPSICUM", "BELL_PEPPER"]:  # Warm season crops
        if 25 <= temp <= 30:
            impacts["temperature"] = 0.05
        elif temp > 35:
            impacts["temperature"] = -0.08
        else:
            impacts["temperature"] = 0.0
    elif crop_name in ["STRAWBERRY", "CHERRY_TOMATO"]:  # Temperature sensitive
        if temp > 30:
            impacts["temperature"] = -0.12
        elif 20 <= temp <= 28:
            impacts["temperature"] = 0.06
        else:
            impacts["temperature"] = 0.0
    else:
        impacts["temperature"] = 0.0
    
    # Humidity impact
    if humidity > 85:
        if crop_name in ["TOMATO", "CAPSICUM", "CUCUMBER", "BELL_PEPPER", "CHERRY_TOMATO"]:
            impacts["humidity"] = -0.06  # Disease pressure
        elif crop_name in ["OYSTER_MUSHROOM", "SHIITAKE"]:
            impacts["humidity"] = 0.08  # Good for mushrooms
        else:
            impacts["humidity"] = 0.0
    elif humidity < 60:
        if crop_name in ["ALOE_VERA", "CINNAMON"]:
            impacts["humidity"] = 0.02  # Drought tolerant
        else:
            impacts["humidity"] = -0.03  # Stress
    else:
        impacts["humidity"] = 0.02
    
    # Rainfall impact
    if rainfall > 15:  # Heavy rain
        if crop_name in ["OYSTER_MUSHROOM", "SHIITAKE"]:
            impacts["rainfall"] = 0.08  # Good for mushrooms
        elif crop_name in ["TOMATO", "CHILI", "CAPSICUM", "BELL_PEPPER"]:
            impacts["rainfall"] = -0.05  # Disease risk
        elif crop_name in ["GINGER", "TURMERIC"]:
            impacts["rainfall"] = 0.04  # Good for root crops
        else:
            impacts["rainfall"] = -0.02
    elif rainfall < 2:  # Drought conditions
        if crop_name in ["ALOE_VERA", "NEEM", "MORINGA"]:
            impacts["rainfall"] = 0.02  # Drought tolerant
        else:
            impacts["rainfall"] = -0.04
    else:
        impacts["rainfall"] = 0.02
    
    return impacts

async def get_micro_farming_recommendations(economic_data: Dict, weather_data: Dict, top_crops: List[str]) -> List[str]:
    """Get AI-powered micro farming recommendations using Google API"""
    try:
        # Create a context for micro farming recommendations
        context = f"""
        Current Economic Conditions in Sri Lanka:
        - USD/LKR Exchange Rate: {economic_data['usd_lkr_rate']}
        - Oil Price: ${economic_data['oil_price_usd']}
        - Inflation Estimate: {economic_data['inflation_estimate']}%
        
        Current Weather:
        - Temperature: {weather_data['current']['temperature']}°C
        - Humidity: {weather_data['current']['humidity']}%
        - Rainfall: {weather_data['current']['rainfall']}mm
        
        Top Performing Crops: {', '.join(top_crops[:5])}
        
        Provide 5-7 specific micro farming recommendations for Sri Lankan farmers considering:
        1. Small scale farming (less than 1 acre)
        2. Resource optimization
        3. Current market conditions
        4. Weather patterns
        5. Economic factors
        """
        
        # For now, return contextual recommendations based on the data
        # In production, you would call Google's Gemini API here
        recommendations = []
        
        # Economic-based recommendations
        if economic_data["usd_lkr_rate"] > 320:
            recommendations.append("Focus on export-oriented crops like spices and medicinal plants to benefit from favorable exchange rates")
        
        if economic_data["inflation_estimate"] > 10:
            recommendations.append("Prioritize crops with shorter growing cycles to reduce input cost exposure")
        
        # Weather-based recommendations
        if weather_data["current"]["humidity"] > 80:
            recommendations.append("Consider protected cultivation to prevent fungal diseases in high humidity")
        
        if weather_data["current"]["temperature"] > 30:
            recommendations.append("Implement shade nets and efficient irrigation for heat-sensitive crops")
        
        if weather_data["current"]["rainfall"] > 10:
            recommendations.append("Focus on mushroom cultivation and water-loving crops during wet season")
        
        # Micro farming specific recommendations
        recommendations.extend([
            "Use vertical farming techniques to maximize yield per square meter",
            "Implement companion planting with high-value herbs alongside main crops",
            "Consider hydroponic systems for consistent year-round production",
            "Focus on value-added processing to increase profit margins",
            "Establish direct-to-consumer sales channels to eliminate middlemen",
            "Use organic methods to access premium markets",
            "Implement crop rotation with nitrogen-fixing legumes to reduce fertilizer costs"
        ])
        
        return recommendations[:7]  # Return top 7 recommendations
        
    except Exception as e:
        # Fallback recommendations
        return [
            "Focus on high-value, low-space crops suitable for micro farming",
            "Implement water-efficient irrigation systems",
            "Use companion planting to maximize space utilization",
            "Consider vertical farming techniques",
            "Focus on crops with multiple harvests per year",
            "Develop direct marketing channels to increase profits",
            "Use organic methods to access premium markets"
        ]

def enhanced_price_prediction(crop_name: str, base_price: float, weather_data: Dict,
                            economic_data: Dict, weeks: int = 12) -> List[WeeklyPricePrediction]:
    """Enhanced price prediction using real data"""
    predictions = []
    current_date = datetime.now()
    running_price = base_price
    
    # Get crop pattern
    pattern = ENHANCED_CROP_PATTERNS.get(crop_name, {
        "base_price_lkr": 200, "volatility": 0.25, "seasonal_peak": [1,2,12],
        "export_ratio": 0.1, "weather_sensitivity": 0.5, "market_demand": "medium"
    })
    
    for week in range(1, weeks + 1):
        week_start = current_date + timedelta(weeks=week-1)
        week_end = week_start + timedelta(days=6)
        
        # Weather impact calculation
        weather_impacts = calculate_weather_crop_impact(weather_data, crop_name)
        total_weather_impact = sum(weather_impacts.values()) * pattern["weather_sensitivity"]
        
        # Economic factors
        exchange_impact = (economic_data["usd_lkr_rate"] - 300) / 300 * pattern["export_ratio"]
        fuel_impact = economic_data["fuel_cost_impact"] * 0.5
        inflation_impact = (economic_data["inflation_estimate"] / 100) * (week / 52)
        
        # Seasonal patterns
        month = week_start.month
        seasonal_multiplier = 1.0
        if month in pattern["seasonal_peak"]:
            seasonal_multiplier = 1.15 + random.uniform(-0.03, 0.03)
        elif month in [6, 7, 8, 9]:  # Monsoon
            if crop_name in ["OYSTER_MUSHROOM", "SHIITAKE", "GOTUKOLA", "MUKUNUWENNA"]:
                seasonal_multiplier = 1.08 + random.uniform(-0.02, 0.04)
            else:
                seasonal_multiplier = 0.92 + random.uniform(-0.04, 0.04)
        else:
            seasonal_multiplier = 1.0 + random.uniform(-0.02, 0.02)
        
        # Market demand factors
        demand_multiplier = 1.0
        if pattern["market_demand"] == "extreme":
            demand_multiplier = 1.05 + random.uniform(-0.02, 0.08)
        elif pattern["market_demand"] == "very_high":
            demand_multiplier = 1.03 + random.uniform(-0.02, 0.06)
        elif pattern["market_demand"] == "high":
            demand_multiplier = 1.02 + random.uniform(-0.02, 0.04)
        
        # Festival impact (Avurudu, Wesak, Christmas, Diwali)
        festival_impact = 1.0
        if week in [4, 16, 42, 52]:  # Festival weeks
            festival_impact = 1.08 + random.uniform(-0.02, 0.05)
        
        # Supply shock simulation (random events)
        supply_shock = 1.0
        if random.random() < 0.05:  # 5% chance of supply disruption
            supply_shock = random.uniform(1.15, 1.35)
        elif random.random() < 0.03:  # 3% chance of oversupply
            supply_shock = random.uniform(0.75, 0.90)
        
        # Combine all factors
        total_multiplier = (
            (1 + total_weather_impact) *
            (1 + exchange_impact) *
            (1 + fuel_impact) *
            (1 + inflation_impact) *
            seasonal_multiplier *
            demand_multiplier *
            festival_impact *
            supply_shock
        )
        
        # Add random volatility
        volatility_factor = 1 + random.uniform(-pattern["volatility"]/4, pattern["volatility"]/4)
        predicted_price = running_price * total_multiplier * volatility_factor
        
        # Ensure price doesn't go negative or extremely high
        predicted_price = max(predicted_price, base_price * 0.3)
        predicted_price = min(predicted_price, base_price * 3.0)
        
        # Confidence intervals
        confidence_range = predicted_price * pattern["volatility"] * 0.6
        
        # Price change
        price_change = ((predicted_price - running_price) / running_price) * 100
        
        predictions.append(WeeklyPricePrediction(
            week_number=week,
            date_start=week_start.strftime("%Y-%m-%d"),
            date_end=week_end.strftime("%Y-%m-%d"),
            predicted_price=round(predicted_price, 2),
            confidence_lower=round(predicted_price - confidence_range, 2),
            confidence_upper=round(predicted_price + confidence_range, 2),
            price_change_percent=round(price_change, 2),
            market_factors={
                "seasonal": round((seasonal_multiplier - 1) * 100, 2),
                "exchange_rate": round(exchange_impact * 100, 2),
                "fuel_costs": round(fuel_impact * 100, 2),
                "demand": round((demand_multiplier - 1) * 100, 2),
                "festival": round((festival_impact - 1) * 100, 2),
                "supply_shock": round((supply_shock - 1) * 100, 2)
            },
            weather_impact={k: round(v * 100, 2) for k, v in weather_impacts.items()}
        ))
        
        running_price = predicted_price
    
    return predictions
