import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import SectionBase from "./SectionBase";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faSeedling, faPlus, faTimes, faCheckCircle, faLeaf, faCalendarAlt, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

function PlanSection({ onBack, onNavigate }) {
    const { t } = useTranslation();
    const [selectedOption, setSelectedOption] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const [showCurrentCropsDialog, setShowCurrentCropsDialog] = useState(false);
    const [isLoadingCrops, setIsLoadingCrops] = useState(true);
    const [formData, setFormData] = useState({
        district: '',
        climate_zone: '',
        experience_level: '',
        budget_level: '',
        farming_setup: '',
        soil_type: '',
        season: '',
        crop_type_preference: '',
        water_access: ''
    });
    const [priceFormData, setPriceFormData] = useState({
        crop_type: '',
        farm_area: '',
        area_unit: 'square_meters',
        location: '',
        planting_date: '',
        farming_experience: '',
        water_source: '',
        investment_level: ''
    });
    const [cropData, setCropData] = useState({
        name: '',
        crop_category: '',
        planting_date: '',
        plant_count: '',
        size: '',
        location: '',
        area_size: ''
    });
    const [results, setResults] = useState(null);
    const [currentCrops, setCurrentCrops] = useState([]);
    const [userId, setUserId] = useState(null);

    // Get user_id from localStorage and monitor for changes
    useEffect(() => {
        const getUserId = () => {
            const storedUserId = localStorage.getItem('user_id');
            console.log('🔍 PlanSection - Getting user_id from localStorage:', storedUserId);
            setUserId(storedUserId);
        };

        // Get initial user ID
        getUserId();

        // Listen for storage changes (when user logs in/out in another tab or component)
        const handleStorageChange = (e) => {
            if (e.key === 'user_id') {
                console.log('🔄 PlanSection - user_id changed in localStorage:', e.newValue);
                setUserId(e.newValue);
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // Also listen for custom events when localStorage is updated in the same tab
        const handleUserChange = () => {
            getUserId();
        };

        window.addEventListener('userChanged', handleUserChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('userChanged', handleUserChange);
        };
    }, []);

    // Fetch user's crops from backend
    const fetchUserCrops = async () => {
        if (!userId) {
            console.log('⚠️ PlanSection - No userId available, skipping crop fetch');
            setCurrentCrops([]);
            setIsLoadingCrops(false);
            return;
        }

        try {
            setIsLoadingCrops(true);

            console.log('🌱 Fetching user crops for userId:', userId);
            console.log('📡 API Endpoint: http://127.0.0.1:8081/crops/user/' + userId);

            const response = await fetch(`http://127.0.0.1:8081/crops/user/${userId}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });

            console.log('📊 Response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('📄 Crops data:', data);

                // Extract crops array from the response object
                const cropsArray = data.crops || [];
                console.log('🌾 Crops array:', cropsArray);

                // Transform backend data to match frontend format
                const transformedCrops = cropsArray.map(crop => {
                    const plantedDate = new Date(crop.planting_date);
                    const currentDate = new Date();
                    const daysPlanted = Math.floor((currentDate - plantedDate) / (1000 * 60 * 60 * 24));

                    // Determine status based on days planted
                    let status = 'planning';
                    if (daysPlanted >= 0) {
                        if (daysPlanted < 30) status = 'growing';
                        else if (daysPlanted < 60) status = 'flowering';
                        else status = 'harvesting';
                    }

                    return {
                        id: crop._id || crop.id,
                        name: crop.name,
                        area: `${crop.area_size || crop.size || 'N/A'} sq.m`,
                        status: status,
                        plantedDate: crop.planting_date,
                        expectedHarvest: crop.estimated_harvest_date || 'TBD',
                        daysPlanted: Math.max(0, daysPlanted),
                        category: crop.crop_category || crop.crop_type,
                        plantCount: crop.plant_count,
                        size: crop.size,
                        location: crop.location
                    };
                });

                setCurrentCrops(transformedCrops);
                console.log('✅ Crops loaded successfully:', transformedCrops.length, 'crops');
            } else {
                const errorData = await response.json();
                console.error('❌ Failed to fetch crops:', errorData);
                setCurrentCrops([]);
            }
        } catch (error) {
            console.error('🔥 Error fetching crops:', error);
            setCurrentCrops([]);
        } finally {
            setIsLoadingCrops(false);
        }
    };

    // Fetch crops when userId changes
    useEffect(() => {
        if (userId) {
            fetchUserCrops();
        } else {
            // Clear crops when no user is logged in
            setCurrentCrops([]);
            setIsLoadingCrops(false);
        }
    }, [userId]);

    const planOptions = [
        {
            id: 'yield-progress-tracker',
            title: 'Yield Progress Tracker',
            icon: faLeaf,
            description: 'Track your crop progress, milestones, and monitor growth stages',
            color: '#FF9800',
            navigateTo: 'yieldProgress'
        },
        {
            id: 'harvest-predictor',
            title: t('Harvest Predictor'),
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

    const districts = [
        'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 'Galle', 'Gampaha', 'Hambantota',
        'Jaffna', 'Kalutara', 'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 'Mannar', 'Matale',
        'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya', 'Polonnaruwa', 'Puttalam', 'Ratnapura',
        'Trincomalee', 'Vavuniya'
    ];

    const climateZones = [
        { value: 'hill_country', label: 'Hill Country' },
        { value: 'coastal', label: 'Coastal' },
        { value: 'dry_zone', label: 'Dry Zone' },
        { value: 'wet_zone', label: 'Wet Zone' },
        { value: 'northern', label: 'Northern' }
    ];

    const experienceLevels = [
        { value: 'Beginner', label: 'Beginner' },
        { value: 'Intermediate', label: 'Intermediate' },
        { value: 'Advanced', label: 'Advanced' }
    ];

    const budgetLevels = [
        { value: 'Low', label: 'Low (Under Rs. 50,000)' },
        { value: 'Medium', label: 'Medium (Rs. 50,000 - 200,000)' },
        { value: 'High', label: 'High (Above Rs. 200,000)' }
    ];

    const farmingSetups = [
        { value: 'Backyard', label: 'Backyard Garden' },
        { value: 'Container', label: 'Container Farming' },
        { value: 'Rooftop', label: 'Rooftop Garden' },
        { value: 'Small_Plot', label: 'Small Plot' },
        { value: 'Greenhouse', label: 'Greenhouse' }
    ];

    const soilTypes = [
        { value: 'Red_Earth', label: 'Red Earth' },
        { value: 'Laterite', label: 'Laterite' },
        { value: 'Clay', label: 'Clay' },
        { value: 'Sandy', label: 'Sandy' },
        { value: 'Alluvial', label: 'Alluvial' },
        { value: 'Loamy', label: 'Loamy' }
    ];

    const seasons = [
        { value: 'Maha', label: 'Maha Season (October - March)' },
        { value: 'Yala', label: 'Yala Season (April - September)' }
    ];

    const cropTypePreferences = [
        { value: 'Vegetables', label: 'Vegetables' },
        { value: 'Fruits', label: 'Fruits' },
        { value: 'Herbs', label: 'Herbs' },
        { value: 'Cash_Crops', label: 'Cash Crops' },
        { value: 'Leafy_Greens', label: 'Leafy Greens' },
        { value: 'Ayurvedic_Plants', label: 'Ayurvedic Plants' }
    ];

    const waterAccessOptions = [
        { value: 'Yes', label: 'Yes - Good water access' },
        { value: 'No', label: 'No - Limited water access' }
    ];

    // Price predictor specific options
    const cropTypes = [
        'Vanilla', 'Saffron', 'Black Pepper', 'Cardamom', 'Dragon Fruit', 'Avocado', 'Strawberry', 'Passion Fruit',
        'Turmeric', 'Ginger', 'Chili', 'Aloe Vera', 'Pomegranate', 'Lime', 'Lemon', 'Tomato', 'Capsicum', 'Eggplant',
        'Cucumber', 'Green Beans', 'Okra', 'Papaya', 'Banana', 'Curry Leaves', 'Basil', 'Mint', 'Lemongrass',
        'Coriander', 'Parsley', 'Guava', 'Cabbage', 'Cauliflower', 'Carrot', 'Onion', 'Beets', 'Spinach', 'Lettuce',
        'Kale', 'Gotukola', 'Mukunuwenna', 'Kankun', 'Sarana', 'Radish', 'Mango', 'Jackfruit', 'Rambutan',
        'Mangosteen', 'Wood Apple', 'Tamarind', 'Moringa', 'Neem', 'Brahmi', 'Ashwagandha', 'Cherry Tomato',
        'Baby Corn', 'Broccoli', 'Zucchini', 'Bell Pepper'
    ];

    const cropCategories = [
        'VANILLA', 'SAFFRON', 'BLACK_PEPPER', 'CARDAMOM', 'DRAGON_FRUIT', 'AVOCADO', 'STRAWBERRY', 'PASSION_FRUIT',
        'TURMERIC', 'GINGER', 'CHILI', 'ALOE_VERA', 'POMEGRANATE', 'LIME', 'LEMON', 'TOMATO', 'CAPSICUM', 'EGGPLANT',
        'CUCUMBER', 'GREEN_BEANS', 'OKRA', 'PAPAYA', 'BANANA', 'CURRY_LEAVES', 'BASIL', 'MINT', 'LEMONGRASS',
        'CORIANDER', 'PARSLEY', 'GUAVA', 'CABBAGE', 'CAULIFLOWER', 'CARROT', 'ONION', 'BEETS', 'SPINACH', 'LETTUCE',
        'KALE', 'GOTUKOLA', 'MUKUNUWENNA', 'KANKUN', 'SARANA', 'RADISH', 'MANGO', 'JACKFRUIT', 'RAMBUTAN',
        'MANGOSTEEN', 'WOOD_APPLE', 'TAMARIND', 'MORINGA', 'NEEM', 'BRAHMI', 'ASHWAGANDHA', 'CHERRY_TOMATO',
        'BABY_CORN', 'BROCCOLI', 'ZUCCHINI', 'BELL_PEPPER'
    ];

    const areaUnits = [
        { value: 'square_meters', label: 'Square Meters' }
    ];

    const farmingExperienceOptions = [
        { value: 'Beginner', label: 'Beginner' },
        { value: 'Intermediate', label: 'Intermediate' },
        { value: 'Advanced', label: 'Advanced' }
    ];

    const waterSourceOptions = [
        { value: 'Rain-fed', label: 'Rain-fed' },
        { value: 'Irrigated', label: 'Irrigated' },
        { value: 'Drip system', label: 'Drip system' }
    ];

    const investmentLevelOptions = [
        { value: 'Low', label: 'Low (Under Rs. 50,000)' },
        { value: 'Medium', label: 'Medium (Rs. 50,000 - 200,000)' },
        { value: 'High', label: 'High (Above Rs. 200,000)' }
    ];

    const handleOptionSelect = (optionId) => {
        const selectedOptionData = planOptions.find(option => option.id === optionId);

        // Check if this option should navigate to another section
        if (selectedOptionData && selectedOptionData.navigateTo && onNavigate) {
            onNavigate(selectedOptionData.navigateTo);
            return;
        }

        // Otherwise, show the dialog for form-based options
        setSelectedOption(optionId);
        setShowDialog(true);
        setResults(null);
        // Reset form data
        setFormData({
            district: '',
            climate_zone: '',
            experience_level: '',
            budget_level: '',
            farming_setup: '',
            soil_type: '',
            season: '',
            crop_type_preference: '',
            water_access: ''
        });
        setPriceFormData({
            crop_type: '',
            farm_area: '',
            area_unit: 'square_meters',
            location: '',
            planting_date: '',
            farming_experience: '',
            water_source: '',
            investment_level: ''
        });
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handlePriceInputChange = (field, value) => {
        setPriceFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleCropInputChange = (field, value) => {
        setCropData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAddCrop = async (e) => {
        e.preventDefault();

        const requiredFields = ['name', 'crop_category', 'planting_date', 'plant_count', 'size', 'location', 'area_size'];
        const missingFields = requiredFields.filter(field => !cropData[field]);

        if (missingFields.length > 0) {
            alert(`Please fill in all fields: ${missingFields.join(', ')}`);
            return;
        }

        if (!userId) {
            alert('❌ User ID not found. Please log in again.');
            return;
        }

        try {
            console.log('🌱 Adding new crop for user:', userId);
            console.log('📡 API Endpoint: http://127.0.0.1:8081/crops/');

            // Convert numeric fields to integers and add user_id from state
            const payload = {
                ...cropData,
                plant_count: parseInt(cropData.plant_count, 10),
                size: parseInt(cropData.size, 10),
                area_size: parseInt(cropData.area_size, 10),
                user_id: userId
            };

            console.log('📦 Payload:', payload);

            const response = await fetch('http://127.0.0.1:8081/crops/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            console.log('📊 Response status:', response.status);

            const data = await response.json();
            console.log('📄 Response data:', data);

            if (response.ok) {
                console.log('✅ Crop added successfully:', data);

                if (data.success) {
                    // Update local state with the new crop using response data
                    const plantedDate = new Date(cropData.planting_date);
                    const currentDate = new Date();
                    const daysPlanted = Math.floor((currentDate - plantedDate) / (1000 * 60 * 60 * 24));

                    const newCrop = {
                        id: data.crop?.id || (currentCrops.length + 1),
                        name: cropData.name,
                        area: `${cropData.area_size} sq.m`,
                        status: data.current_phase || (daysPlanted < 0 ? 'planning' : daysPlanted < 30 ? 'growing' : daysPlanted < 60 ? 'flowering' : 'harvesting'),
                        plantedDate: cropData.planting_date,
                        expectedHarvest: data.estimated_harvest_date || 'TBD',
                        daysPlanted: Math.max(0, daysPlanted),
                        progress: data.initial_progress || 0,
                        milestonesCreated: data.milestones_created || 0,
                        upcomingTasks: data.upcoming_tasks?.length || 0
                    };

                    // Refresh crops list from backend instead of adding to local state
                    await fetchUserCrops();

                    // Dispatch custom event to notify other components about crop changes
                    window.dispatchEvent(new CustomEvent('cropsUpdated', {
                        detail: { userId: userId, action: 'added', cropId: data.crop?.id }
                    }));

                    // Reset form
                    setCropData({
                        name: '',
                        crop_category: '',
                        planting_date: '',
                        plant_count: '',
                        size: '',
                        location: '',
                        area_size: ''
                    });

                    setShowCurrentCropsDialog(false);

                    // Show detailed success message
                    const successMsg = `✅ ${data.message || 'Crop added successfully!'}\n` +
                        `📅 Estimated Harvest: ${data.estimated_harvest_date || 'TBD'}\n` +
                        `📊 Initial Progress: ${data.initial_progress || 0}%\n` +
                        `🎯 Milestones Created: ${data.milestones_created || 0}\n` +
                        `📋 Upcoming Tasks: ${data.upcoming_tasks?.length || 0}`;

                    alert(successMsg);
                } else {
                    console.error('❌ Crop creation failed:', data);
                    alert(`Failed to add crop: ${data.message || 'Unknown error'}`);
                }
            } else {
                console.error('❌ Failed to add crop:', data);
                alert(`Failed to add crop: ${data.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('🔥 Crop addition error:', error);

            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                alert('❌ Cannot connect to server. Please make sure the backend is running on http://127.0.0.1:8081');
            } else if (error.name === 'SyntaxError' && error.message.includes('JSON')) {
                alert('❌ Server response error. Please try again.');
            } else {
                alert('❌ Network error. Please check your connection and try again.');
            }
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'growing': return '#4CAF50';
            case 'flowering': return '#9C27B0';
            case 'harvesting': return '#FF9800';
            case 'planning': return '#2196F3';
            default: return '#757575';
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedOption === 'harvest-predictor') {
            // Validate price predictor form
            const requiredPriceFields = ['crop_type', 'farm_area', 'area_unit', 'location', 'planting_date', 'farming_experience', 'water_source', 'investment_level'];
            const missingPriceFields = requiredPriceFields.filter(field => !priceFormData[field]);

            if (missingPriceFields.length > 0) {
                alert(`Please fill in all fields: ${missingPriceFields.join(', ')}`);
                return;
            }

            try {
                console.log('💰 Requesting price prediction...');
                console.log('📡 API Endpoint: http://127.0.0.1:8081/harvest/predict-yield');

                // Convert farm_area to integer for API payload
                const payload = {
                    ...priceFormData,
                    farm_area: parseInt(priceFormData.farm_area, 10)
                };

                console.log('📦 Payload:', payload);

                const response = await fetch('http://127.0.0.1:8081/harvest/predict-yield', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });

                console.log('📊 Response status:', response.status);

                const data = await response.json();
                console.log('📄 Response data:', data);

                if (response.ok) {
                    console.log('✅ Harvest prediction received:', data);

                    // Transform harvest prediction response for UI
                    const transformedResults = {
                        success: true,
                        message: 'Harvest prediction completed successfully',
                        harvestDetails: {
                            crop: priceFormData.crop_type,
                            expected_yield_kg: data.expected_yield_kg,
                            yield_per_m2: data.yield_per_m2,
                            harvest_window: data.harvest_window,
                            confidence_percentage: data.confidence_percentage,
                            estimated_revenue_lkr: data.estimated_revenue_lkr,
                            season_type: data.season_type,
                            days_to_harvest: data.days_to_harvest,
                            recommendations: data.recommendations || []
                        }
                    };

                    setResults(transformedResults);
                } else {
                    console.error('❌ Price prediction failed:', data);
                    alert(`Failed to get price prediction: ${data.message || 'Unknown error'}`);
                }
            } catch (error) {
                console.error('🔥 Price prediction error:', error);

                if (error.name === 'TypeError' && error.message.includes('fetch')) {
                    alert('❌ Cannot connect to server. Please make sure the backend is running on http://127.0.0.1:8081');
                } else if (error.name === 'SyntaxError' && error.message.includes('JSON')) {
                    alert('❌ Server response error. Please try again.');
                } else {
                    alert('❌ Network error. Please check your connection and try again.');
                }
            }
        } else {
            // Validate crop recommendation form
            const requiredFields = ['district', 'climate_zone', 'experience_level', 'budget_level', 'farming_setup', 'soil_type', 'season', 'crop_type_preference', 'water_access'];
            const missingFields = requiredFields.filter(field => !formData[field]);

            if (missingFields.length > 0) {
                alert(`Please fill in all fields: ${missingFields.join(', ')}`);
                return;
            }

            // For crop recommender, call the actual API
            try {
                console.log('🌱 Requesting crop recommendations...');
                console.log('📡 API Endpoint: http://127.0.0.1:8081/crop-recommendation/api/v1/predict-crops');

                const payload = {
                    district: formData.district,
                    climate_zone: formData.climate_zone,
                    experience_level: formData.experience_level,
                    budget_level: formData.budget_level,
                    farming_setup: formData.farming_setup,
                    soil_type: formData.soil_type,
                    season: formData.season,
                    crop_type_preference: formData.crop_type_preference,
                    water_access: formData.water_access
                };

                console.log('📦 Payload:', payload);

                const response = await fetch('http://127.0.0.1:8081/crop-recommendation/api/v1/predict-crops', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });

                console.log('📊 Response status:', response.status);

                const data = await response.json();
                console.log('📄 Response data:', data);

                if (response.ok && data.success) {
                    console.log('✅ Crop recommendations received:', data);

                    // Transform the API response to match our UI format
                    const transformedResults = {
                        success: data.success,
                        message: data.message,
                        totalRecommendations: data.total_recommendations,
                        recommendedCrops: data.recommendations.map(crop => ({
                            name: crop.crop_name,
                            predictedScore: crop.predicted_score,
                            rank: crop.rank,
                            successProbability: crop.success_probability,
                            estimatedROI: crop.estimated_roi,
                            spaceRequired: crop.space_required_sqm,
                            growthDuration: crop.growth_duration_days,
                            difficultyLevel: crop.difficulty_level,
                            marketDemand: crop.market_demand,
                            marketPrice: crop.market_price_per_kg,
                            waterRequirement: crop.water_requirement,
                            marketConditions: crop.market_conditions,
                            alternativeCrops: crop.alternative_crops
                        })),
                        requestDetails: data.request_details
                    };

                    setResults(transformedResults);
                } else {
                    console.error('❌ Crop recommendation failed:', data);
                    alert(`Failed to get crop recommendations: ${data.message || 'Unknown error'}`);
                }
            } catch (error) {
                console.error('🔥 Crop recommendation error:', error);

                if (error.name === 'TypeError' && error.message.includes('fetch')) {
                    alert('❌ Cannot connect to server. Please make sure the backend is running on http://127.0.0.1:8081');
                } else if (error.name === 'SyntaxError' && error.message.includes('JSON')) {
                    alert('❌ Server response error. Please try again.');
                } else {
                    alert('❌ Network error. Please check your connection and try again.');
                }
            }
        }
    };

    const closeDialog = () => {
        setShowDialog(false);
        setSelectedOption(null);
        setResults(null);
    };

    return (
        <>
            <SectionBase title={t('farmingPlan')}>
                <div className="plan-section-content">
                    {/* Current Crops Section */}
                    <div className="current-crops-section">
                        <div className="section-header">
                            <h2 className="section-title">
                                <FontAwesomeIcon icon={faLeaf} style={{ marginRight: '10px', color: '#4CAF50' }} />
                                Current Crops
                            </h2>
                            <button
                                className="add-crop-btn"
                                onClick={() => setShowCurrentCropsDialog(true)}
                            >
                                <FontAwesomeIcon icon={faPlus} />
                                Add New Crop
                            </button>
                        </div>

                        <div className="current-crops-grid">
                            {isLoadingCrops ? (
                                <div className="loading-crops">
                                    <div className="loading-spinner">🌱</div>
                                    <p>Loading your crops...</p>
                                </div>
                            ) : currentCrops.length > 0 ? (
                                currentCrops.map((crop) => (
                                    <div key={crop.id} className="crop-card">
                                        <div className="crop-header">
                                            <h3 className="crop-name">{crop.name}</h3>
                                            <span
                                                className="crop-status"
                                                style={{ backgroundColor: getStatusColor(crop.status) }}
                                            >
                                                {crop.status.charAt(0).toUpperCase() + crop.status.slice(1)}
                                            </span>
                                        </div>
                                        <div className="crop-details">
                                            <div className="crop-detail-item">
                                                <FontAwesomeIcon icon={faMapMarkerAlt} />
                                                <span>Area: {crop.area}</span>
                                            </div>
                                            <div className="crop-detail-item">
                                                <FontAwesomeIcon icon={faCalendarAlt} />
                                                <span>Days Planted: {crop.daysPlanted}</span>
                                            </div>
                                            <div className="crop-detail-item">
                                                <FontAwesomeIcon icon={faCalendarAlt} />
                                                <span>Planted: {new Date(crop.plantedDate).toLocaleDateString()}</span>
                                            </div>
                                            <div className="crop-detail-item">
                                                <FontAwesomeIcon icon={faCalendarAlt} />
                                                <span>Expected Harvest: {crop.expectedHarvest === 'TBD' ? 'TBD' : new Date(crop.expectedHarvest).toLocaleDateString()}</span>
                                            </div>
                                            {crop.location && (
                                                <div className="crop-detail-item">
                                                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                                                    <span>Location: {crop.location}</span>
                                                </div>
                                            )}
                                            {crop.plantCount && (
                                                <div className="crop-detail-item">
                                                    <FontAwesomeIcon icon={faSeedling} />
                                                    <span>Plants: {crop.plantCount}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="no-crops">
                                    <div className="no-crops-icon">🌾</div>
                                    <h3>No Crops Added Yet</h3>
                                    <p>Start your farming journey by adding your first crop!</p>
                                    <button
                                        className="add-first-crop-btn"
                                        onClick={() => setShowCurrentCropsDialog(true)}
                                    >
                                        <FontAwesomeIcon icon={faPlus} />
                                        Add Your First Crop
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Planning Tools Section */}
                    <div className="planning-tools-section">
                        <h2 className="section-title">
                            <FontAwesomeIcon icon={faChartLine} style={{ marginRight: '10px', color: '#2196F3' }} />
                            Planning Tools
                        </h2>
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
                                        Please provide the following information to get accurate {selectedOption === 'harvest-predictor' ? 'price predictions' : 'crop recommendations'}:
                                    </p>

                                    <div className="form-grid">
                                        {selectedOption === 'harvest-predictor' ? (
                                            <>
                                                <div className="input-group">
                                                    <label htmlFor="crop_type">Crop Type:</label>
                                                    <select
                                                        id="crop_type"
                                                        value={priceFormData.crop_type}
                                                        onChange={(e) => handlePriceInputChange('crop_type', e.target.value)}
                                                        required
                                                    >
                                                        <option value="">Select crop type</option>
                                                        {cropTypes.map(crop => (
                                                            <option key={crop} value={crop}>{crop}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="input-group">
                                                    <label htmlFor="farm_area">Farm Area:</label>
                                                    <input
                                                        type="number"
                                                        id="farm_area"
                                                        value={priceFormData.farm_area}
                                                        onChange={(e) => handlePriceInputChange('farm_area', e.target.value)}
                                                        placeholder="Enter farm area"
                                                        required
                                                    />
                                                </div>

                                                <div className="input-group">
                                                    <label htmlFor="area_unit">Area Unit:</label>
                                                    <select
                                                        id="area_unit"
                                                        value={priceFormData.area_unit}
                                                        onChange={(e) => handlePriceInputChange('area_unit', e.target.value)}
                                                        required
                                                    >
                                                        {areaUnits.map(unit => (
                                                            <option key={unit.value} value={unit.value}>{unit.label}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="input-group">
                                                    <label htmlFor="location">Location:</label>
                                                    <select
                                                        id="location"
                                                        value={priceFormData.location}
                                                        onChange={(e) => handlePriceInputChange('location', e.target.value)}
                                                        required
                                                    >
                                                        <option value="">Select district</option>
                                                        {districts.map(district => (
                                                            <option key={district} value={district}>{district}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="input-group">
                                                    <label htmlFor="planting_date">Planting Date:</label>
                                                    <input
                                                        type="date"
                                                        id="planting_date"
                                                        value={priceFormData.planting_date}
                                                        onChange={(e) => handlePriceInputChange('planting_date', e.target.value)}
                                                        required
                                                    />
                                                </div>

                                                <div className="input-group">
                                                    <label htmlFor="farming_experience">Farming Experience:</label>
                                                    <select
                                                        id="farming_experience"
                                                        value={priceFormData.farming_experience}
                                                        onChange={(e) => handlePriceInputChange('farming_experience', e.target.value)}
                                                        required
                                                    >
                                                        <option value="">Select experience level</option>
                                                        {farmingExperienceOptions.map(exp => (
                                                            <option key={exp.value} value={exp.value}>{exp.label}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="input-group">
                                                    <label htmlFor="water_source">Water Source:</label>
                                                    <select
                                                        id="water_source"
                                                        value={priceFormData.water_source}
                                                        onChange={(e) => handlePriceInputChange('water_source', e.target.value)}
                                                        required
                                                    >
                                                        <option value="">Select water source</option>
                                                        {waterSourceOptions.map(source => (
                                                            <option key={source.value} value={source.value}>{source.label}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="input-group">
                                                    <label htmlFor="investment_level">Investment Level:</label>
                                                    <select
                                                        id="investment_level"
                                                        value={priceFormData.investment_level}
                                                        onChange={(e) => handlePriceInputChange('investment_level', e.target.value)}
                                                        required
                                                    >
                                                        <option value="">Select investment level</option>
                                                        {investmentLevelOptions.map(level => (
                                                            <option key={level.value} value={level.value}>{level.label}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="input-group">
                                                    <label htmlFor="district">District:</label>
                                                    <select
                                                        id="district"
                                                        value={formData.district}
                                                        onChange={(e) => handleInputChange('district', e.target.value)}
                                                        required
                                                    >
                                                        <option value="">Select your district</option>
                                                        {districts.map(district => (
                                                            <option key={district} value={district}>{district}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="input-group">
                                                    <label htmlFor="climate_zone">Climate Zone:</label>
                                                    <select
                                                        id="climate_zone"
                                                        value={formData.climate_zone}
                                                        onChange={(e) => handleInputChange('climate_zone', e.target.value)}
                                                        required
                                                    >
                                                        <option value="">Select climate zone</option>
                                                        {climateZones.map(zone => (
                                                            <option key={zone.value} value={zone.value}>{zone.label}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="input-group">
                                                    <label htmlFor="experience_level">Experience Level:</label>
                                                    <select
                                                        id="experience_level"
                                                        value={formData.experience_level}
                                                        onChange={(e) => handleInputChange('experience_level', e.target.value)}
                                                        required
                                                    >
                                                        <option value="">Select experience level</option>
                                                        {experienceLevels.map(level => (
                                                            <option key={level.value} value={level.value}>{level.label}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="input-group">
                                                    <label htmlFor="budget_level">Budget Level:</label>
                                                    <select
                                                        id="budget_level"
                                                        value={formData.budget_level}
                                                        onChange={(e) => handleInputChange('budget_level', e.target.value)}
                                                        required
                                                    >
                                                        <option value="">Select budget level</option>
                                                        {budgetLevels.map(budget => (
                                                            <option key={budget.value} value={budget.value}>{budget.label}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="input-group">
                                                    <label htmlFor="farming_setup">Farming Setup:</label>
                                                    <select
                                                        id="farming_setup"
                                                        value={formData.farming_setup}
                                                        onChange={(e) => handleInputChange('farming_setup', e.target.value)}
                                                        required
                                                    >
                                                        <option value="">Select farming setup</option>
                                                        {farmingSetups.map(setup => (
                                                            <option key={setup.value} value={setup.value}>{setup.label}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="input-group">
                                                    <label htmlFor="soil_type">Soil Type:</label>
                                                    <select
                                                        id="soil_type"
                                                        value={formData.soil_type}
                                                        onChange={(e) => handleInputChange('soil_type', e.target.value)}
                                                        required
                                                    >
                                                        <option value="">Select soil type</option>
                                                        {soilTypes.map(soil => (
                                                            <option key={soil.value} value={soil.value}>{soil.label}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="input-group">
                                                    <label htmlFor="season">Season:</label>
                                                    <select
                                                        id="season"
                                                        value={formData.season}
                                                        onChange={(e) => handleInputChange('season', e.target.value)}
                                                        required
                                                    >
                                                        <option value="">Select season</option>
                                                        {seasons.map(season => (
                                                            <option key={season.value} value={season.value}>{season.label}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="input-group">
                                                    <label htmlFor="crop_type_preference">Crop Type Preference:</label>
                                                    <select
                                                        id="crop_type_preference"
                                                        value={formData.crop_type_preference}
                                                        onChange={(e) => handleInputChange('crop_type_preference', e.target.value)}
                                                        required
                                                    >
                                                        <option value="">Select crop preference</option>
                                                        {cropTypePreferences.map(crop => (
                                                            <option key={crop.value} value={crop.value}>{crop.label}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="input-group">
                                                    <label htmlFor="water_access">Water Access:</label>
                                                    <select
                                                        id="water_access"
                                                        value={formData.water_access}
                                                        onChange={(e) => handleInputChange('water_access', e.target.value)}
                                                        required
                                                    >
                                                        <option value="">Select water access</option>
                                                        {waterAccessOptions.map(water => (
                                                            <option key={water.value} value={water.value}>{water.label}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <button type="submit" className="submit-plan-btn">
                                        <FontAwesomeIcon icon={faCheckCircle} />
                                        Generate {selectedOption === 'harvest-predictor' ? 'Price Prediction' : 'Crop Recommendations'}
                                    </button>
                                </form>
                            ) : (
                                <div className="results-display">
                                    {selectedOption === 'harvest-predictor' ? (
                                        <div className="harvest-results">
                                            <h4>🌾 Harvest Prediction Results</h4>
                                            {results.harvestDetails ? (
                                                <div className="results-grid">
                                                    <div className="result-card">
                                                        <label>Crop:</label>
                                                        <span>{results.harvestDetails.crop}</span>
                                                    </div>
                                                    <div className="result-card">
                                                        <label>Expected Yield:</label>
                                                        <span>{results.harvestDetails.expected_yield_kg} kg</span>
                                                    </div>
                                                    <div className="result-card">
                                                        <label>Yield per m²:</label>
                                                        <span>{results.harvestDetails.yield_per_m2}`</span>
                                                    </div>
                                                    <div className="result-card">
                                                        <label>Harvest Window:</label>
                                                        <span>{results.harvestDetails.harvest_window || 'N/A'}</span>
                                                    </div>
                                                    <div className="result-card">
                                                        <label>Confidence:</label>
                                                        <span>{results.harvestDetails.confidence_percentage}%</span>
                                                    </div>
                                                    <div className="result-card">
                                                        <label>Estimated Revenue:</label>
                                                        <span>Rs.{results.harvestDetails.estimated_revenue_lkr}</span>
                                                    </div>
                                                    <div className="result-card">
                                                        <label>Season Type:</label>
                                                        <span>{results.harvestDetails.season_type || 'N/A'}</span>
                                                    </div>
                                                    <div className="result-card">
                                                        <label>Days to Harvest:</label>
                                                        <span>{results.harvestDetails.days_to_harvest} days</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p>No harvest prediction data available.</p>
                                            )}

                                            {results.harvestDetails?.recommendations && results.harvestDetails.recommendations.length > 0 && (
                                                <div className="recommendations-section">
                                                    <h5>📋 Recommendations:</h5>
                                                    <ul className="recommendations-list">
                                                        {results.harvestDetails.recommendations.map((rec, index) => (
                                                            <li key={index}>{rec}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="crop-results">
                                            <div className="results-header">
                                                <h4>🌱 Crop Recommendations</h4>
                                                {results.message && (
                                                    <p className="api-message">{results.message}</p>
                                                )}
                                                <div className="results-summary">
                                                    <span className="total-count">{results.totalRecommendations || results.recommendedCrops?.length || 0} crops recommended</span>
                                                </div>
                                            </div>

                                            <div className="recommended-crops">
                                                {results.recommendedCrops && results.recommendedCrops.length > 0 ? (
                                                    results.recommendedCrops.map((crop, index) => (
                                                        <div key={index} className="crop-recommendation-card">
                                                            <div className="crop-card-header">
                                                                <div className="crop-title-section">
                                                                    <h5 className="crop-name">{crop.name}</h5>
                                                                    <div className="crop-badges">
                                                                        <span className="rank-badge">#{crop.rank || index + 1}</span>
                                                                        <span className={`score-badge ${crop.predictedScore >= 0.8 ? 'excellent' : crop.predictedScore >= 0.6 ? 'good' : 'fair'}`}>
                                                                            Score: {crop.predictedScore?.toFixed(2) || 'N/A'}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="success-indicator">
                                                                    <div className="success-circle">
                                                                        <span className="success-percentage">{crop.successProbability || crop.suitability}%</span>
                                                                        <small>Success Rate</small>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="crop-details-grid">
                                                                <div className="detail-group financial">
                                                                    <h6>💰 Financial</h6>
                                                                    <div className="detail-items">
                                                                        <div className="detail-item">
                                                                            <span className="label">Expected ROI</span>
                                                                            <span className="value roi-value">
                                                                                {crop.estimatedROI ? `${crop.estimatedROI.toFixed(1)}%` : (crop.profitability ? `${crop.profitability}%` : 'N/A')}
                                                                            </span>
                                                                        </div>
                                                                        <div className="detail-item">
                                                                            <span className="label">Market Price</span>
                                                                            <span className="value">Rs.{crop.marketPrice || 'N/A'}/kg</span>
                                                                        </div>
                                                                        <div className="detail-item">
                                                                            <span className="label">Market Demand</span>
                                                                            <span className="value">
                                                                                <div className="rating-bar">
                                                                                    <div className="rating-fill" style={{ width: `${(crop.marketDemand || 0) * 10}%` }}></div>
                                                                                    <span>{crop.marketDemand || 'N/A'}/10</span>
                                                                                </div>
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="detail-group cultivation">
                                                                    <h6>🌾 Cultivation</h6>
                                                                    <div className="detail-items">
                                                                        <div className="detail-item">
                                                                            <span className="label">Growth Duration</span>
                                                                            <span className="value">{crop.growthDuration || 'N/A'} days</span>
                                                                        </div>
                                                                        <div className="detail-item">
                                                                            <span className="label">Space Required</span>
                                                                            <span className="value">{crop.spaceRequired || 'N/A'} sq.m</span>
                                                                        </div>
                                                                        <div className="detail-item">
                                                                            <span className="label">Difficulty Level</span>
                                                                            <span className="value">
                                                                                <div className="difficulty-indicator">
                                                                                    {[...Array(10)].map((_, i) => (
                                                                                        <div
                                                                                            key={i}
                                                                                            className={`difficulty-dot ${i < (crop.difficultyLevel || 0) ? 'filled' : ''}`}
                                                                                        ></div>
                                                                                    ))}
                                                                                    <span>{crop.difficultyLevel || 'N/A'}/10</span>
                                                                                </div>
                                                                            </span>
                                                                        </div>
                                                                        {crop.waterRequirement && (
                                                                            <div className="detail-item">
                                                                                <span className="label">Water Requirement</span>
                                                                                <span className="value water-req">{crop.waterRequirement}</span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {crop.alternativeCrops && crop.alternativeCrops.length > 0 && (
                                                                <div className="alternative-crops-section">
                                                                    <h6>🔄 Alternative Options</h6>
                                                                    <div className="alternative-tags">
                                                                        {crop.alternativeCrops.map((altCrop, altIndex) => (
                                                                            <span key={altIndex} className="alternative-tag">{altCrop}</span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="no-results">
                                                        <div className="no-results-icon">🌱</div>
                                                        <h5>No Recommendations Available</h5>
                                                        <p>Try adjusting your preferences and conditions to get better recommendations.</p>
                                                    </div>
                                                )}
                                            </div>

                                            {results.requestDetails && (
                                                <div className="request-summary">
                                                    <h6>📋 Request Summary</h6>
                                                    <div className="summary-tags">
                                                        <span className="summary-tag">📍 {results.requestDetails.district}</span>
                                                        <span className="summary-tag">🌤️ {results.requestDetails.climate_zone}</span>
                                                        <span className="summary-tag">📅 {results.requestDetails.season}</span>
                                                        <span className="summary-tag">🌱 {results.requestDetails.crop_type_preference}</span>
                                                        <span className="summary-tag">🏠 {results.requestDetails.farming_setup}</span>
                                                    </div>
                                                </div>
                                            )}
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

            {/* Add New Crop Dialog */}
            {showCurrentCropsDialog && (
                <div className="plan-dialog-overlay" onClick={() => setShowCurrentCropsDialog(false)}>
                    <div className="plan-dialog" onClick={(e) => e.stopPropagation()}>
                        <div className="dialog-header">
                            <h3>
                                <FontAwesomeIcon
                                    icon={faLeaf}
                                    style={{ marginRight: '10px', color: '#4CAF50' }}
                                />
                                Add New Crop
                            </h3>
                            <button className="close-btn" onClick={() => setShowCurrentCropsDialog(false)}>
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>

                        <div className="dialog-content">
                            <form onSubmit={handleAddCrop} className="plan-form">
                                <p className="form-description">
                                    Add a new crop to your current cultivation list:
                                </p>

                                <div className="form-grid">
                                    <div className="input-group">
                                        <label htmlFor="name">Crop Name:</label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={cropData.name}
                                            onChange={(e) => handleCropInputChange('name', e.target.value)}
                                            placeholder="Enter crop name"
                                            required
                                        />
                                    </div>

                                    <div className="input-group">
                                        <label htmlFor="crop_category">Crop Category:</label>
                                        <select
                                            id="crop_category"
                                            value={cropData.crop_category}
                                            onChange={(e) => handleCropInputChange('crop_category', e.target.value)}
                                            required
                                        >
                                            <option value="">Select crop category</option>
                                            {cropCategories.map(category => (
                                                <option key={category} value={category}>{category.replace(/_/g, ' ')}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="input-group">
                                        <label htmlFor="planting_date">Planting Date:</label>
                                        <input
                                            type="date"
                                            id="planting_date"
                                            value={cropData.planting_date}
                                            onChange={(e) => handleCropInputChange('planting_date', e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="input-group">
                                        <label htmlFor="plant_count">Plant Count:</label>
                                        <input
                                            type="number"
                                            id="plant_count"
                                            value={cropData.plant_count}
                                            onChange={(e) => handleCropInputChange('plant_count', e.target.value)}
                                            placeholder="Number of plants"
                                            min="1"
                                            required
                                        />
                                    </div>

                                    <div className="input-group">
                                        <label htmlFor="size">Plant Size:</label>
                                        <input
                                            type="number"
                                            id="size"
                                            value={cropData.size}
                                            onChange={(e) => handleCropInputChange('size', e.target.value)}
                                            placeholder="Plant size"
                                            min="1"
                                            required
                                        />
                                    </div>

                                    <div className="input-group">
                                        <label htmlFor="location">Location:</label>
                                        <select
                                            id="location"
                                            value={cropData.location}
                                            onChange={(e) => handleCropInputChange('location', e.target.value)}
                                            required
                                        >
                                            <option value="">Select district</option>
                                            {districts.map(district => (
                                                <option key={district} value={district}>{district}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="input-group">
                                        <label htmlFor="area_size">Area Size (sq.m):</label>
                                        <input
                                            type="number"
                                            id="area_size"
                                            value={cropData.area_size}
                                            onChange={(e) => handleCropInputChange('area_size', e.target.value)}
                                            placeholder="Area in square meters"
                                            min="1"
                                            required
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="submit-plan-btn">
                                    <FontAwesomeIcon icon={faCheckCircle} />
                                    Add Crop
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            <style jsx>{`
                .crop-results {
                    max-height: 80vh;
                    overflow-y: auto;
                }

                .results-header {
                    text-align: center;
                    margin-bottom: 2rem;
                    padding-bottom: 1rem;
                    border-bottom: 2px solid #f0f0f0;
                }

                .results-header h4 {
                    margin: 0 0 0.5rem 0;
                    color: #2c5530;
                    font-size: 1.5rem;
                }

                .api-message {
                    color: #666;
                    font-style: italic;
                    margin: 0.5rem 0;
                }

                .results-summary {
                    margin-top: 0.5rem;
                }

                .total-count {
                    background: #e8f5e8;
                    color: #2c5530;
                    padding: 0.25rem 0.75rem;
                    border-radius: 20px;
                    font-size: 0.9rem;
                    font-weight: 500;
                }

                .crop-recommendation-card {
                    background: #fff;
                    border: 1px solid #e0e0e0;
                    border-radius: 12px;
                    margin-bottom: 1.5rem;
                    overflow: hidden;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }

                .crop-recommendation-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                }

                .crop-card-header {
                    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                    padding: 1.25rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid #e0e0e0;
                }

                .crop-title-section {
                    flex: 1;
                }

                .crop-name {
                    margin: 0 0 0.5rem 0;
                    color: #2c5530;
                    font-size: 1.25rem;
                    font-weight: 600;
                }

                .crop-badges {
                    display: flex;
                    gap: 0.5rem;
                }

                .rank-badge {
                    background: #4CAF50;
                    color: white;
                    padding: 0.25rem 0.5rem;
                    border-radius: 12px;
                    font-size: 0.8rem;
                    font-weight: 600;
                }

                .score-badge {
                    padding: 0.25rem 0.5rem;
                    border-radius: 12px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: white;
                }

                .score-badge.excellent {
                    background: #2e7d32;
                }

                .score-badge.good {
                    background: #f57c00;
                }

                .score-badge.fair {
                    background: #d32f2f;
                }

                .success-indicator {
                    display: flex;
                    align-items: center;
                }

                .success-circle {
                    background: #fff;
                    border: 3px solid #4CAF50;
                    border-radius: 50%;
                    width: 80px;
                    height: 80px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                }

                .success-percentage {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #4CAF50;
                    line-height: 1;
                }

                .success-circle small {
                    font-size: 0.7rem;
                    color: #666;
                    margin-top: 2px;
                }

                .crop-details-grid {
                    padding: 1.25rem;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                }

                @media (max-width: 768px) {
                    .crop-details-grid {
                        grid-template-columns: 1fr;
                    }
                }

                .detail-group {
                    background: #f8f9fa;
                    border-radius: 8px;
                    padding: 1rem;
                }

                .detail-group h6 {
                    margin: 0 0 0.75rem 0;
                    color: #2c5530;
                    font-size: 0.9rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .detail-items {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .detail-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.5rem 0;
                    border-bottom: 1px solid #e9ecef;
                }

                .detail-item:last-child {
                    border-bottom: none;
                }

                .detail-item .label {
                    font-size: 0.85rem;
                    color: #666;
                    font-weight: 500;
                }

                .detail-item .value {
                    font-weight: 600;
                    color: #333;
                    font-size: 0.9rem;
                }

                .roi-value {
                    color: #4CAF50 !important;
                    font-weight: 700;
                }

                .water-req {
                    background: #e3f2fd;
                    color: #1976d2;
                    padding: 0.25rem 0.5rem;
                    border-radius: 12px;
                    font-size: 0.8rem;
                }

                .rating-bar {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    position: relative;
                    background: #e0e0e0;
                    border-radius: 10px;
                    height: 8px;
                    width: 60px;
                    overflow: hidden;
                }

                .rating-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #4CAF50, #8BC34A);
                    border-radius: 10px;
                    transition: width 0.3s ease;
                }

                .rating-bar span {
                    font-size: 0.8rem;
                    margin-left: 0.5rem;
                }

                .difficulty-indicator {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                }

                .difficulty-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: #e0e0e0;
                    transition: background 0.2s ease;
                }

                .difficulty-dot.filled {
                    background: #ff9800;
                }

                .difficulty-indicator span {
                    margin-left: 0.5rem;
                    font-size: 0.8rem;
                }

                .alternative-crops-section {
                    padding: 1rem 1.25rem;
                    background: #f1f8e9;
                    border-top: 1px solid #e0e0e0;
                }

                .alternative-crops-section h6 {
                    margin: 0 0 0.75rem 0;
                    color: #2c5530;
                    font-size: 0.9rem;
                    font-weight: 600;
                }

                .alternative-tags {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                }

                .alternative-tag {
                    background: #c8e6c9;
                    color: #2e7d32;
                    padding: 0.25rem 0.75rem;
                    border-radius: 16px;
                    font-size: 0.8rem;
                    font-weight: 500;
                }

                .no-results {
                    text-align: center;
                    padding: 3rem 1rem;
                    color: #666;
                }

                .no-results-icon {
                    font-size: 4rem;
                    margin-bottom: 1rem;
                }

                .no-results h5 {
                    margin: 0 0 0.5rem 0;
                    color: #333;
                }

                .request-summary {
                    margin-top: 2rem;
                    padding: 1rem;
                    background: #f8f9fa;
                    border-radius: 8px;
                    border: 1px solid #e0e0e0;
                }

                .request-summary h6 {
                    margin: 0 0 0.75rem 0;
                    color: #2c5530;
                    font-size: 0.9rem;
                    font-weight: 600;
                }

                .summary-tags {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                }

                .summary-tag {
                    background: #e8f5e8;
                    color: #2c5530;
                    padding: 0.5rem 0.75rem;
                    border-radius: 20px;
                    font-size: 0.85rem;
                    font-weight: 500;
                    border: 1px solid #c8e6c9;
                }
            `}</style>
        </>
    );
}

export default PlanSection;