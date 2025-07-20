import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import SectionBase from "./SectionBase";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faSeedling, faPlus, faTimes, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

function PlanSection({ onBack }) {
    const { t } = useTranslation();
    const [selectedOption, setSelectedOption] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const [formData, setFormData] = useState({
        vegetable: '',
        season: '',
        rainfall: '',
        temperature: '',
        soilPh: '',
        farmArea: ''
    });
    const [results, setResults] = useState(null);

    const planOptions = [
        {
            id: 'price-predictor',
            title: t('pricePredictor'),
            icon: faChartLine,
            description: 'Predict crop prices and market trends to optimize your farming decisions',
            color: '#4CAF50'
        },
        {
            id: 'crop-recommender',
            title: t('cropRecommender'),
            icon: faSeedling,
            description: 'Get personalized crop recommendations based on soil, climate, and market conditions',
            color: '#2196F3'
        }
    ];

    const vegetables = [
        'Tomato', 'Carrot', 'Cabbage', 'Beans', 'Corn', 'Potato', 'Onion', 'Lettuce', 'Cucumber', 'Pepper'
    ];

    const seasons = [
        'Spring', 'Summer', 'Monsoon', 'Autumn', 'Winter'
    ];

    const handleOptionSelect = (optionId) => {
        setSelectedOption(optionId);
        setShowDialog(true);
        setResults(null);
        // Reset form data
        setFormData({
            vegetable: '',
            season: '',
            rainfall: '',
            temperature: '',
            soilPh: '',
            farmArea: ''
        });
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const generateRandomResults = (type) => {
        if (type === 'price-predictor') {
            return {
                currentPrice: (Math.random() * 50 + 20).toFixed(2),
                predictedPrice: (Math.random() * 60 + 25).toFixed(2),
                priceChange: ((Math.random() - 0.5) * 20).toFixed(2),
                confidence: (Math.random() * 30 + 70).toFixed(1),
                expectedYield: (Math.random() * 5000 + 2000).toFixed(0),
                expectedRevenue: (Math.random() * 100000 + 50000).toFixed(0)
            };
        } else {
            const recommendedCrops = vegetables.slice().sort(() => 0.5 - Math.random()).slice(0, 3);
            return {
                recommendedCrops: recommendedCrops.map(crop => ({
                    name: crop,
                    suitability: (Math.random() * 30 + 70).toFixed(1),
                    expectedYield: (Math.random() * 5000 + 2000).toFixed(0),
                    profitability: (Math.random() * 30 + 70).toFixed(1)
                })),
                soilHealth: (Math.random() * 30 + 70).toFixed(1),
                weatherMatch: (Math.random() * 30 + 70).toFixed(1)
            };
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();


        const requiredFields = ['vegetable', 'season', 'rainfall', 'temperature', 'soilPh', 'farmArea'];
        const missingFields = requiredFields.filter(field => !formData[field]);

        if (missingFields.length > 0) {
            alert(`Please fill in all fields: ${missingFields.join(', ')}`);
            return;
        }
        const generatedResults = generateRandomResults(selectedOption);
        setResults(generatedResults);
    };

    const closeDialog = () => {
        setShowDialog(false);
        setSelectedOption(null);
        setResults(null);
    };

    return (
        <>
            <SectionBase title={t('farmingPlan')} onBack={onBack}>
                <div className="plan-section-content">
                    <p className="section-description">
                        Choose from our planning tools to optimize your farming strategy and maximize your yields.
                    </p>

                    <div className="plan-options-grid">
                        {planOptions.map((option) => (
                            <div
                                key={option.id}
                                className={`plan-option-card ${selectedOption === option.id ? 'selected' : ''}`}
                                onClick={() => handleOptionSelect(option.id)}
                            >
                                <div
                                    className="option-icon"
                                    style={{ color: option.color }}
                                >
                                    <FontAwesomeIcon icon={option.icon} />
                                </div>
                                <h3 className="option-title">{option.title}</h3>
                                <p className="option-description">{option.description}</p>
                                <div className="option-action">
                                    <FontAwesomeIcon icon={faPlus} />
                                    <span>Select</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </SectionBase>

            {/* Input Dialog */}
            {showDialog && (
                <div className="plan-dialog-overlay" onClick={closeDialog}>
                    <div className="plan-dialog" onClick={(e) => e.stopPropagation()}>
                        <div className="dialog-header">
                            <h3>
                                <FontAwesomeIcon
                                    icon={planOptions.find(opt => opt.id === selectedOption)?.icon}
                                    style={{ marginRight: '10px', color: planOptions.find(opt => opt.id === selectedOption)?.color }}
                                />
                                {planOptions.find(opt => opt.id === selectedOption)?.title}
                            </h3>
                            <button className="close-btn" onClick={closeDialog}>
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>

                        <div className="dialog-content">
                            {!results ? (
                                <form onSubmit={handleSubmit} className="plan-form">
                                    <p className="form-description">
                                        Please provide the following information to get accurate {selectedOption === 'price-predictor' ? 'price predictions' : 'crop recommendations'}:
                                    </p>

                                    <div className="form-grid">
                                        <div className="input-group">
                                            <label htmlFor="vegetable">{t('vegetable')}:</label>
                                            <select
                                                id="vegetable"
                                                value={formData.vegetable}
                                                onChange={(e) => handleInputChange('vegetable', e.target.value)}
                                                required
                                            >
                                                <option value="">Select a vegetable</option>
                                                {vegetables.map(veg => (
                                                    <option key={veg} value={veg}>{veg}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="input-group">
                                            <label htmlFor="season">{t('season')}:</label>
                                            <select
                                                id="season"
                                                value={formData.season}
                                                onChange={(e) => handleInputChange('season', e.target.value)}
                                                required
                                            >
                                                <option value="">Select season</option>
                                                {seasons.map(season => (
                                                    <option key={season} value={season}>{season}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="input-group">
                                            <label htmlFor="rainfall">{t('rainfall')}:</label>
                                            <input
                                                type="number"
                                                id="rainfall"
                                                placeholder="e.g., 800"
                                                value={formData.rainfall}
                                                onChange={(e) => handleInputChange('rainfall', e.target.value)}
                                                required
                                                min="0"
                                            />
                                        </div>

                                        <div className="input-group">
                                            <label htmlFor="temperature">{t('temperature')}:</label>
                                            <input
                                                type="number"
                                                id="temperature"
                                                placeholder="e.g., 25"
                                                value={formData.temperature}
                                                onChange={(e) => handleInputChange('temperature', e.target.value)}
                                                required
                                                min="-10"
                                                max="50"
                                            />
                                        </div>

                                        <div className="input-group">
                                            <label htmlFor="soilPh">{t('soilPh')}:</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                id="soilPh"
                                                placeholder="e.g., 6.5"
                                                value={formData.soilPh}
                                                onChange={(e) => handleInputChange('soilPh', e.target.value)}
                                                required
                                                min="0"
                                                max="14"
                                            />
                                        </div>

                                        <div className="input-group">
                                            <label htmlFor="farmArea">{t('farmArea')}:</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                id="farmArea"
                                                placeholder="e.g., 5.5"
                                                value={formData.farmArea}
                                                onChange={(e) => handleInputChange('farmArea', e.target.value)}
                                                required
                                                min="0.1"
                                            />
                                        </div>
                                    </div>

                                    <button type="submit" className="submit-plan-btn">
                                        <FontAwesomeIcon icon={faCheckCircle} />
                                        Generate {selectedOption === 'price-predictor' ? 'Price Prediction' : 'Crop Recommendations'}
                                    </button>
                                </form>
                            ) : (
                                <div className="results-display">
                                    {selectedOption === 'price-predictor' ? (
                                        <div className="price-results">
                                            <h4>Price Prediction Results</h4>
                                            <div className="results-grid">
                                                <div className="result-card">
                                                    <label>Current Price:</label>
                                                    <span>${results.currentPrice}/kg</span>
                                                </div>
                                                <div className="result-card">
                                                    <label>Predicted Price:</label>
                                                    <span>${results.predictedPrice}/kg</span>
                                                </div>
                                                <div className="result-card">
                                                    <label>Price Change:</label>
                                                    <span className={results.priceChange >= 0 ? 'positive' : 'negative'}>
                                                        {results.priceChange >= 0 ? '+' : ''}{results.priceChange}%
                                                    </span>
                                                </div>
                                                <div className="result-card">
                                                    <label>Confidence:</label>
                                                    <span>{results.confidence}%</span>
                                                </div>
                                                <div className="result-card">
                                                    <label>Expected Yield:</label>
                                                    <span>{results.expectedYield} kg</span>
                                                </div>
                                                <div className="result-card">
                                                    <label>Expected Revenue:</label>
                                                    <span>Rs.{results.expectedRevenue}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="crop-results">
                                            <h4>Crop Recommendations</h4>
                                            <div className="recommended-crops">
                                                <h5>Top Recommended Crops:</h5>
                                                {results.recommendedCrops.map((crop, index) => (
                                                    <div key={index} className="crop-recommendation">
                                                        <div className="crop-name">{crop.name}</div>
                                                        <div className="crop-stats">
                                                            <span>Suitability: {crop.suitability}%</span>
                                                            <span>Expected Yield: {crop.expectedYield} kg</span>
                                                            <span>Profitability: {crop.profitability}%</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="environmental-stats">
                                                <div className="stat-item">
                                                    <label>Soil Health Score:</label>
                                                    <span>{results.soilHealth}%</span>
                                                </div>
                                                <div className="stat-item">
                                                    <label>Weather Match:</label>
                                                    <span>{results.weatherMatch}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <button onClick={closeDialog} className="close-results-btn">
                                        Close Results
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default PlanSection;