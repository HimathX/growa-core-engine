import pandas as pd
import numpy as np
from typing import List, Dict, Any
import os
from schemas import CropPredictionRequest, CropRecommendation, PredictionResponse
import logging

DATASET_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "docs", "Sri_lanka_micro_farm_dataset.csv")

class CropPredictionService:
    def __init__(self, dataset_path: str = DATASET_PATH):
        self.dataset_path = dataset_path
        self.df = None
        self.load_dataset()
        
    def load_dataset(self):
        """Load the dataset from CSV file"""
        try:
            if not os.path.exists(self.dataset_path):
                raise FileNotFoundError(f"Dataset file not found: {self.dataset_path}")
            
            self.df = pd.read_csv(self.dataset_path)
            logging.info(f"Dataset loaded successfully with {len(self.df)} records")
            
        except Exception as e:
            logging.error(f"Error loading dataset: {str(e)}")
            raise
    
    def filter_similar_conditions(self, request: CropPredictionRequest, top_n: int = 50) -> pd.DataFrame:
        """Filter dataset for similar farming conditions"""
        if self.df is None:
            raise ValueError("Dataset not loaded")
        
        # Create scoring system for similarity
        filtered_df = self.df.copy()
        filtered_df['similarity_score'] = 0
        
        # Exact matches get higher scores
        conditions = {
            'climate_zone': request.climate_zone,
            'experience_level': request.experience_level,
            'budget_level': request.budget_level,
            'farming_setup': request.farming_setup,
            'soil_type': request.soil_type,
            'season': request.season,
            'crop_type_preference': request.crop_type_preference,
            'water_access': request.water_access
        }
        
        weights = {
            'climate_zone': 3,
            'soil_type': 3,
            'season': 2,
            'farming_setup': 2,
            'experience_level': 2,
            'budget_level': 1,
            'crop_type_preference': 2,
            'water_access': 1
        }
        
        for column, value in conditions.items():
            if column in filtered_df.columns:
                mask = filtered_df[column] == value
                filtered_df.loc[mask, 'similarity_score'] += weights.get(column, 1)
        
        # Sort by similarity score and profitability
        filtered_df = filtered_df.sort_values(['similarity_score', 'profitability_score'], ascending=[False, False])
        
        return filtered_df.head(top_n)
    
    def get_crop_recommendations(self, request: CropPredictionRequest) -> List[CropRecommendation]:
        """Get crop recommendations based on request conditions"""
        try:
            # Filter similar conditions
            similar_records = self.filter_similar_conditions(request)
            
            if similar_records.empty:
                return []
            
            # Aggregate recommendations by crop
            crop_stats = {}
            
            # Process recommendation columns
            for _, row in similar_records.iterrows():
                for i in range(1, 4):  # recommendation_1, recommendation_2, recommendation_3
                    crop_col = f'recommendation_{i}'
                    score_col = f'recommendation_{i}_score'
                    
                    if crop_col in row and score_col in row:
                        crop_name = row[crop_col]
                        score = row[score_col]
                        
                        if pd.notna(crop_name) and pd.notna(score):
                            if crop_name not in crop_stats:
                                crop_stats[crop_name] = {
                                    'scores': [],
                                    'success_prob': [],
                                    'roi': [],
                                    'space': [],
                                    'duration': [],
                                    'difficulty': [],
                                    'market_demand': [],
                                    'market_price': [],
                                    'water_req': [],
                                    'market_conditions': [],
                                    'alternatives': []
                                }
                            
                            crop_stats[crop_name]['scores'].append(score)
                            crop_stats[crop_name]['success_prob'].append(row.get('success_probability', 0.5))
                            crop_stats[crop_name]['roi'].append(row.get('estimated_roi', 50))
                            crop_stats[crop_name]['space'].append(row.get('space_required_sqm', 2))
                            crop_stats[crop_name]['duration'].append(row.get('growth_duration_days', 90))
                            crop_stats[crop_name]['difficulty'].append(row.get('difficulty_level', 2))
                            crop_stats[crop_name]['market_demand'].append(row.get('market_demand', 8))
                            crop_stats[crop_name]['market_price'].append(row.get('market_price_per_kg', 200))
                            crop_stats[crop_name]['water_req'].append(row.get('water_requirement', 'Medium'))
                            crop_stats[crop_name]['market_conditions'].append(row.get('market_conditions', 1.0))
                            
                            # Parse alternative crops
                            alternatives = str(row.get('alternative_crops', '')).split(', ') if pd.notna(row.get('alternative_crops')) else []
                            crop_stats[crop_name]['alternatives'].extend(alternatives)
            
            # Convert to recommendations
            recommendations = []
            rank = 1
            
            # Sort crops by average score
            sorted_crops = sorted(crop_stats.items(), 
                                key=lambda x: np.mean(x[1]['scores']), 
                                reverse=True)
            
            for crop_name, stats in sorted_crops[:10]:  # Top 10 recommendations
                # Get unique alternatives
                unique_alternatives = list(set([alt.strip() for alt in stats['alternatives'] if alt.strip()]))[:3]
                
                recommendation = CropRecommendation(
                    crop_name=crop_name,
                    predicted_score=round(np.mean(stats['scores']), 1),
                    rank=rank,
                    success_probability=round(np.mean(stats['success_prob']), 3),
                    estimated_roi=round(np.mean(stats['roi']), 1),
                    space_required_sqm=round(np.mean(stats['space']), 1),
                    growth_duration_days=int(np.mean(stats['duration'])),
                    difficulty_level=int(np.mean(stats['difficulty'])),
                    market_demand=int(np.mean(stats['market_demand'])),
                    market_price_per_kg=round(np.mean(stats['market_price']), 0),
                    water_requirement=max(set(stats['water_req']), key=stats['water_req'].count),
                    market_conditions=round(np.mean(stats['market_conditions']), 2),
                    alternative_crops=unique_alternatives
                )
                recommendations.append(recommendation)
                rank += 1
            
            return recommendations
            
        except Exception as e:
            logging.error(f"Error generating recommendations: {str(e)}")
            raise
    
    def predict(self, request: CropPredictionRequest) -> PredictionResponse:
        """Main prediction method"""
        try:
            recommendations = self.get_crop_recommendations(request)
            
            if not recommendations:
                return PredictionResponse(
                    success=False,
                    message="No suitable crop recommendations found for the given conditions.",
                    recommendations=[],
                    total_recommendations=0,
                    request_details=request
                )
            
            return PredictionResponse(
                success=True,
                message=f"Found {len(recommendations)} crop recommendations based on your conditions.",
                recommendations=recommendations,
                total_recommendations=len(recommendations),
                request_details=request
            )
            
        except Exception as e:
            logging.error(f"Prediction error: {str(e)}")
            return PredictionResponse(
                success=False,
                message=f"Error generating predictions: {str(e)}",
                recommendations=[],
                total_recommendations=0,
                request_details=request
            )

# Global service instance
prediction_service = CropPredictionService()