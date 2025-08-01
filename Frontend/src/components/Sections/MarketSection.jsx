import React, { useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function MarketSection({ onBack }) {
    // All available crops with categories
    const allCropsData = {
        // Spices & High-Value Crops
        "Vanilla": { category: "Spices", color: "#8B4513", season: "Year round", notes: "Premium spice crop" },
        "Saffron": { category: "Spices", color: "#FF8C00", season: "Oct-Nov", notes: "World's most expensive spice" },
        "Black Pepper": { category: "Spices", color: "#2F4F4F", season: "Year round", notes: "King of spices" },
        "Cardamom": { category: "Spices", color: "#228B22", season: "Year round", notes: "Queen of spices" },
        "Turmeric": { category: "Spices", color: "#FFD700", season: "Year round", notes: "Golden spice with medicinal value" },
        "Ginger": { category: "Spices", color: "#CD853F", season: "Year round", notes: "High demand spice crop" },
        "Chili": { category: "Spices", color: "#DC143C", season: "Year round", notes: "Essential spice crop" },

        // Exotic Fruits
        "Dragon Fruit": { category: "Exotic Fruits", color: "#FF1493", season: "Year round", notes: "Premium exotic fruit" },
        "Avocado": { category: "Exotic Fruits", color: "#9ACD32", season: "Year round", notes: "High-value superfruit" },
        "Strawberry": { category: "Exotic Fruits", color: "#FF69B4", season: "Dec-Mar", notes: "Premium berry crop" },
        "Passion Fruit": { category: "Exotic Fruits", color: "#800080", season: "Year round", notes: "High-value tropical fruit" },
        "Pomegranate": { category: "Exotic Fruits", color: "#B22222", season: "Oct-Feb", notes: "Antioxidant-rich fruit" },

        // Citrus Fruits
        "Lime": { category: "Citrus", color: "#32CD32", season: "Year round", notes: "Essential citrus crop" },
        "Lemon": { category: "Citrus", color: "#FFFF00", season: "Year round", notes: "High demand citrus" },

        // Common Vegetables
        "Tomato": { category: "Vegetables", color: "#FF6347", season: "Year round", notes: "Staple vegetable crop" },
        "Capsicum": { category: "Vegetables", color: "#FF4500", season: "Year round", notes: "High-value vegetable" },
        "Bell Pepper": { category: "Vegetables", color: "#FFD700", season: "Year round", notes: "Premium pepper variety" },
        "Eggplant": { category: "Vegetables", color: "#9370DB", season: "Year round", notes: "Popular local vegetable" },
        "Cucumber": { category: "Vegetables", color: "#90EE90", season: "Year round", notes: "Fresh market favorite" },
        "Green Beans": { category: "Vegetables", color: "#228B22", season: "Year round", notes: "Export potential crop" },
        "Okra": { category: "Vegetables", color: "#6B8E23", season: "Year round", notes: "Traditional vegetable" },
        "Cherry Tomato": { category: "Vegetables", color: "#FF69B4", season: "Year round", notes: "Premium tomato variety" },
        "Baby Corn": { category: "Vegetables", color: "#F0E68C", season: "Year round", notes: "Export quality vegetable" },
        "Broccoli": { category: "Vegetables", color: "#228B22", season: "Cool season", notes: "Nutritious brassica" },
        "Zucchini": { category: "Vegetables", color: "#32CD32", season: "Year round", notes: "Fast-growing squash" },

        // Traditional Fruits
        "Papaya": { category: "Traditional Fruits", color: "#FF8C00", season: "Year round", notes: "Fast-growing fruit" },
        "Banana": { category: "Traditional Fruits", color: "#FFD700", season: "Year round", notes: "Staple fruit crop" },
        "Guava": { category: "Traditional Fruits", color: "#98FB98", season: "Year round", notes: "Vitamin C rich fruit" },
        "Mango": { category: "Traditional Fruits", color: "#FF8C00", season: "Apr-Jul", notes: "King of fruits" },
        "Jackfruit": { category: "Traditional Fruits", color: "#DAA520", season: "Apr-Aug", notes: "Large tropical fruit" },
        "Rambutan": { category: "Traditional Fruits", color: "#DC143C", season: "Jun-Sep", notes: "Sweet tropical fruit" },
        "Mangosteen": { category: "Traditional Fruits", color: "#800080", season: "May-Aug", notes: "Queen of fruits" },
        "Wood Apple": { category: "Traditional Fruits", color: "#8B4513", season: "Oct-Dec", notes: "Traditional medicinal fruit" },
        "Tamarind": { category: "Traditional Fruits", color: "#A0522D", season: "Feb-May", notes: "Souring agent fruit" },

        // Herbs & Medicinal Plants
        "Aloe Vera": { category: "Medicinal", color: "#90EE90", season: "Year round", notes: "Medicinal and cosmetic plant" },
        "Curry Leaves": { category: "Herbs", color: "#228B22", season: "Year round", notes: "Essential culinary herb" },
        "Basil": { category: "Herbs", color: "#32CD32", season: "Year round", notes: "Aromatic culinary herb" },
        "Mint": { category: "Herbs", color: "#00FF7F", season: "Year round", notes: "Refreshing herb" },
        "Lemongrass": { category: "Herbs", color: "#9ACD32", season: "Year round", notes: "Aromatic herb for tea" },
        "Coriander": { category: "Herbs", color: "#228B22", season: "Cool season", notes: "Popular culinary herb" },
        "Parsley": { category: "Herbs", color: "#32CD32", season: "Cool season", notes: "Nutritious herb" },
        "Moringa": { category: "Medicinal", color: "#228B22", season: "Year round", notes: "Superfood tree" },
        "Neem": { category: "Medicinal", color: "#556B2F", season: "Year round", notes: "Medicinal tree" },
        "Brahmi": { category: "Medicinal", color: "#32CD32", season: "Year round", notes: "Memory enhancing herb" },
        "Ashwagandha": { category: "Medicinal", color: "#8FBC8F", season: "Year round", notes: "Adaptogenic herb" },

        // Leafy Greens & Root Vegetables
        "Cabbage": { category: "Leafy Greens", color: "#90EE90", season: "Cool season", notes: "Bulk vegetable crop" },
        "Cauliflower": { category: "Leafy Greens", color: "#F5F5DC", season: "Cool season", notes: "Premium brassica" },
        "Carrot": { category: "Root Vegetables", color: "#FF8C00", season: "Cool season", notes: "Nutritious root crop" },
        "Onion": { category: "Root Vegetables", color: "#DDA0DD", season: "Year round", notes: "Essential vegetable" },
        "Beets": { category: "Root Vegetables", color: "#DC143C", season: "Cool season", notes: "Nutritious root vegetable" },
        "Spinach": { category: "Leafy Greens", color: "#228B22", season: "Cool season", notes: "Iron-rich leafy green" },
        "Lettuce": { category: "Leafy Greens", color: "#90EE90", season: "Cool season", notes: "Salad crop" },
        "Kale": { category: "Leafy Greens", color: "#006400", season: "Cool season", notes: "Superfood green" },
        "Radish": { category: "Root Vegetables", color: "#FF69B4", season: "Cool season", notes: "Fast-growing root crop" },

        // Sri Lankan Traditional Greens
        "Gotukola": { category: "Traditional Greens", color: "#228B22", season: "Year round", notes: "Traditional Sri Lankan green" },
        "Mukunuwenna": { category: "Traditional Greens", color: "#32CD32", season: "Year round", notes: "Nutritious local green" },
        "Kankun": { category: "Traditional Greens", color: "#228B22", season: "Year round", notes: "Water spinach variety" },
        "Sarana": { category: "Traditional Greens", color: "#90EE90", season: "Year round", notes: "Traditional leafy vegetable" }
    };

    const categories = [
        "Spices", "Exotic Fruits", "Citrus", "Vegetables", "Traditional Fruits",
        "Herbs", "Medicinal", "Leafy Greens", "Root Vegetables", "Traditional Greens"
    ];

    // State for selected crops and UI
    const [selectedCrops, setSelectedCrops] = useState(['Tomato']);
    const [savedSelections, setSavedSelections] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('Spices');
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

    // API parameters state
    const [location, setLocation] = useState('Colombo');
    const [weeks, setWeeks] = useState(12);
    const [priceData, setPriceData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);

    // Sri Lankan districts/locations
    const locations = [
        'Colombo', 'Kandy', 'Galle', 'Jaffna', 'Anuradhapura', 'Trincomalee',
        'Batticaloa', 'Kurunegala', 'Ratnapura', 'Badulla', 'Matara', 'Kalutara',
        'Gampaha', 'Hambantota', 'Polonnaruwa', 'Matale', 'Kegalle', 'Nuwara Eliya'
    ];

    // Fetch price predictions from backend
    const fetchPricePredictions = async () => {
        if (selectedCrops.length === 0) {
            alert('Please select at least one crop before fetching prices.');
            return;
        }

        setIsLoading(true);
        const newPriceData = {};

        try {
            console.log(`🔄 Fetching price predictions for ${selectedCrops.length} crops...`);

            // Fetch data for each selected crop
            for (const crop of selectedCrops) {
                console.log(`📡 Fetching: http://127.0.0.1:8081/market/prices/${crop}?weeks=${weeks}&location=${location}`);

                const response = await fetch(
                    `http://127.0.0.1:8081/market/prices/${crop}?weeks=${weeks}&location=${location}`,
                    {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                        },
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    newPriceData[crop] = data;
                    console.log(`✅ ${crop} price data loaded:`, data);
                } else {
                    console.error(`❌ Failed to fetch ${crop} prices:`, response.status);
                    newPriceData[crop] = { error: `Failed to load (${response.status})` };
                }
            }

            setPriceData(newPriceData);
            setLastUpdated(new Date());
            console.log('🎉 All price predictions loaded successfully');

        } catch (error) {
            console.error('🔥 Error fetching price predictions:', error);
            alert('Error connecting to server. Please ensure the backend is running.');
        } finally {
            setIsLoading(false);
        }
    };

    // Filter crops based on category and search
    const filteredCrops = Object.keys(allCropsData).filter(crop => {
        const matchesCategory = allCropsData[crop].category === selectedCategory;
        const matchesSearch = crop.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Handle crop selection
    const toggleCropSelection = (crop) => {
        setSelectedCrops(prev => {
            if (prev.includes(crop)) {
                return prev.filter(c => c !== crop);
            } else {
                return [...prev, crop];
            }
        });
    };

    // Select all crops in current filtered view
    const selectAllVisible = () => {
        const newSelections = [...new Set([...selectedCrops, ...filteredCrops])];
        setSelectedCrops(newSelections);
    };

    // Deselect all crops
    const deselectAll = () => {
        setSelectedCrops([]);
    };

    // Select all crops in a category
    const selectCategory = (category) => {
        const categorysCrops = Object.keys(allCropsData).filter(
            crop => allCropsData[crop].category === category
        );
        const newSelections = [...new Set([...selectedCrops, ...categorysCrops])];
        setSelectedCrops(newSelections);
    };

    // Save current selection
    const saveCurrentSelection = () => {
        if (selectedCrops.length === 0) {
            alert('Please select at least one crop before saving.');
            return;
        }

        const selectionName = prompt('Enter a name for this selection:');
        if (selectionName && selectionName.trim()) {
            const newSelection = {
                id: Date.now(),
                name: selectionName.trim(),
                crops: [...selectedCrops],
                createdAt: new Date().toLocaleDateString()
            };
            setSavedSelections(prev => [...prev, newSelection]);
            alert(`Selection "${selectionName}" saved successfully!`);
        }
    };

    // Load saved selection
    const loadSelection = (selection) => {
        setSelectedCrops(selection.crops);
    };

    // Delete saved selection
    const deleteSelection = (selectionId) => {
        if (confirm('Are you sure you want to delete this selection?')) {
            setSavedSelections(prev => prev.filter(s => s.id !== selectionId));
        }
    };

    return (
        <div>
            <style>{`
            .market-container {
                padding: 20px;
                font-family: 'Poppins', sans-serif;
            }
            
            .crop-selection-panel {
                background-color: #f9fdfc;
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 20px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            }
            
            .selection-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            }
            
            .selection-controls {
                display: flex;
                gap: 15px;
                margin-bottom: 20px;
                flex-wrap: wrap;
                align-items: center;
            }
            
            .search-input {
                padding: 8px 12px;
                border: 2px solid #e0e0e0;
                border-radius: 6px;
                font-size: 14px;
                min-width: 200px;
                transition: border-color 0.2s ease;
            }
            
            .search-input:focus {
                outline: none;
                border-color: #4CAF50;
            }
            
            .category-select {
                padding: 8px 12px;
                border: 2px solid #e0e0e0;
                border-radius: 6px;
                font-size: 14px;
                background-color: white;
                cursor: pointer;
                transition: border-color 0.2s ease;
            }
            
            .category-select:focus {
                outline: none;
                border-color: #4CAF50;
            }
            
            .bulk-actions {
                display: flex;
                gap: 8px;
                flex-wrap: wrap;
            }
            
            .bulk-btn {
                padding: 6px 12px;
                border: 1px solid #e0e0e0;
                border-radius: 4px;
                background-color: white;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.2s ease;
            }
            
            .bulk-btn:hover {
                background-color: #f0f0f0;
            }
            
            .bulk-btn.select-all {
                background-color: #4CAF50;
                color: white;
                border-color: #4CAF50;
            }
            
            .bulk-btn.deselect-all {
                background-color: #f44336;
                color: white;
                border-color: #f44336;
            }
            
            .selection-summary {
                background-color: #e8f5e8;
                padding: 10px 15px;
                border-radius: 6px;
                margin-bottom: 15px;
                border-left: 4px solid #4CAF50;
            }

            .api-parameters {
                background-color: #f0fff4;
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 15px;
                border: 1px solid #c8e6c9;
            }

            .api-parameters h4 {
                margin: 0 0 15px 0;
                color: #2e7d32;
                font-size: 16px;
            }

            .parameter-controls {
                display: flex;
                gap: 15px;
                align-items: end;
                flex-wrap: wrap;
            }

            .parameter-group {
                display: flex;
                flex-direction: column;
                min-width: 150px;
            }

            .parameter-group label {
                font-size: 12px;
                font-weight: 600;
                color: #555;
                margin-bottom: 5px;
            }

            .parameter-select {
                padding: 8px 12px;
                border: 2px solid #e0e0e0;
                border-radius: 6px;
                font-size: 14px;
                background-color: white;
                cursor: pointer;
                transition: border-color 0.2s ease;
            }

            .parameter-select:focus {
                outline: none;
                border-color: #4CAF50;
            }

            .fetch-prices-btn {
                background: linear-gradient(135deg, #4CAF50, #388e3c);
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 600;
                transition: all 0.2s ease;
                min-height: 40px;
                display: flex;
                align-items: center;
                gap: 5px;
            }

            .fetch-prices-btn:hover:not(:disabled) {
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
            }

            .fetch-prices-btn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                transform: none;
            }

            .last-updated {
                font-size: 11px;
                color: #666;
                margin-top: 10px;
                font-style: italic;
            }
            
            .view-toggle {
                display: flex;
                border: 1px solid #e0e0e0;
                border-radius: 4px;
                overflow: hidden;
            }
            
            .view-btn {
                padding: 6px 12px;
                border: none;
                background-color: white;
                cursor: pointer;
                transition: background-color 0.2s ease;
            }
            
            .view-btn.active {
                background-color: #4CAF50;
                color: white;
            }
            
            .crop-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 10px;
                margin-bottom: 20px;
            }
            
            .crop-list {
                display: flex;
                flex-direction: column;
                gap: 8px;
                margin-bottom: 20px;
                max-height: 400px;
                overflow-y: auto;
                border: 1px solid #e0e0e0;
                border-radius: 6px;
                padding: 10px;
            }
            
            .crop-checkbox {
                display: flex;
                align-items: center;
                padding: 10px 15px;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s ease;
                background-color: white;
                position: relative;
            }
            
            .crop-checkbox:hover {
                border-color: #4CAF50;
                background-color: #f8fff9;
            }
            
            .crop-checkbox.selected {
                border-color: #4CAF50;
                background-color: #e8f5e8;
            }
            
            .crop-checkbox input {
                margin-right: 10px;
                transform: scale(1.2);
            }
            
            .crop-color-indicator {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                margin-right: 8px;
            }
            
            .crop-info {
                flex: 1;
                display: flex;
                flex-direction: column;
            }
            
            .crop-name {
                font-weight: 600;
                color: #333;
            }
            
            .crop-category {
                font-size: 11px;
                color: #666;
                margin-top: 2px;
            }
            
            .category-section {
                margin-bottom: 25px;
            }
            
            .category-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 0;
                border-bottom: 2px solid #e0e0e0;
                margin-bottom: 10px;
            }
            
            .category-title {
                font-weight: 600;
                color: #333;
                font-size: 16px;
            }
            
            .category-select-btn {
                padding: 4px 8px;
                background-color: #4CAF50;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 11px;
                transition: background-color 0.2s ease;
            }
            
            .category-select-btn:hover {
                background-color: #45a049;
            }
            
            .save-selection-btn {
                background: linear-gradient(135deg, #4CAF50, #45a049);
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                display: flex;
                align-items: center;
                gap: 5px;
                transition: transform 0.2s ease;
            }
            
            .save-selection-btn:hover {
                transform: translateY(-1px);
            }
            
            .saved-selections {
                margin-top: 15px;
                padding-top: 15px;
                border-top: 1px solid #e0e0e0;
            }
            
            .saved-selection-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 12px;
                background-color: white;
                border: 1px solid #e0e0e0;
                border-radius: 6px;
                margin-bottom: 8px;
            }
            
            .selection-info {
                flex: 1;
            }
            
            .selection-actions {
                display: flex;
                gap: 8px;
            }
            
            .action-btn {
                padding: 4px 8px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                transition: background-color 0.2s ease;
            }
            
            .load-btn {
                background-color: #4CAF50;
                color: white;
            }
            
            .delete-btn {
                background-color: #f44336;
                color: white;
            }
            
            .action-btn:hover {
                opacity: 0.8;
            }

            .no-results {
                text-align: center;
                padding: 40px;
                color: #666;
                background-color: #f9f9f9;
                border-radius: 8px;
                border: 2px dashed #ddd;
            }

            .price-chart {
                background-color: #f9fdfc;
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 20px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                font-family: 'Poppins', sans-serif;
            }
            
            .chart-info {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
            }
            
            .selected-count {
                color: #666;
                font-size: 14px;
            }

            .price-results {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
                margin-top: 20px;
            }

            .crop-price-card {
                background-color: white;
                border-radius: 12px;
                padding: 20px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                border: 1px solid #e0e0e0;
                transition: transform 0.2s ease;
            }

            .crop-price-card:hover {
                transform: translateY(-2px);
            }

            .crop-price-card.loading {
                border-color: #ffc107;
                background-color: #fff9c4;
            }

            .crop-price-card.error {
                border-color: #f44336;
                background-color: #ffebee;
            }

            .crop-price-card.success {
                border-color: #4caf50;
                background-color: #f8fff9;
            }

            .crop-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 1px solid #e0e0e0;
            }

            .crop-header h4 {
                margin: 0;
                color: #333;
                font-size: 18px;
            }

            .crop-color-dot {
                width: 16px;
                height: 16px;
                border-radius: 50%;
                border: 2px solid white;
                box-shadow: 0 0 0 1px #ddd;
            }

            .price-summary {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .price-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 0;
            }

            .price-label {
                font-weight: 500;
                color: #666;
                font-size: 14px;
            }

            .price-value {
                font-weight: 600;
                color: #2e7d32;
                font-size: 16px;
            }

            .trend {
                font-weight: 600;
                font-size: 14px;
            }

            .trend.up {
                color: #4caf50;
            }

            .trend.down {
                color: #f44336;
            }

            .trend.stable {
                color: #ff9800;
            }

            .confidence {
                font-weight: 600;
                color: #558b2f;
                font-size: 14px;
            }

            .weekly-preview {
                margin-top: 15px;
                padding-top: 15px;
                border-top: 1px solid #e0e0e0;
            }

            .weekly-preview h5 {
                margin: 0 0 10px 0;
                color: #555;
                font-size: 14px;
            }

            .weekly-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 8px;
            }

            .week-item {
                display: flex;
                flex-direction: column;
                padding: 8px 10px;
                background-color: #f5f5f5;
                border-radius: 6px;
                font-size: 12px;
                border: 1px solid #e0e0e0;
            }

            .week-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 4px;
            }

            .week-label {
                color: #666;
                font-weight: 600;
            }

            .week-price {
                font-weight: 600;
                color: #333;
                font-size: 13px;
            }

            .week-details {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 11px;
            }

            .week-change {
                font-weight: 600;
            }

            .week-change.positive {
                color: #4caf50;
            }

            .week-change.negative {
                color: #f44336;
            }

            .week-date {
                color: #888;
                font-size: 10px;
            }

            .view-all-weeks {
                margin-top: 10px;
                text-align: center;
            }

            .view-all-btn {
                background-color: #4CAF50;
                color: white;
                border: none;
                padding: 6px 12px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 11px;
                transition: background-color 0.2s ease;
            }

            .view-all-btn:hover {
                background-color: #45a049;
            }

            .market-factors {
                margin-top: 15px;
                padding-top: 10px;
                border-top: 1px solid #e0e0e0;
            }

            .market-factors h6 {
                margin: 0 0 8px 0;
                color: #555;
                font-size: 13px;
                font-weight: 600;
            }

            .factors-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 4px;
            }

            .factor-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 3px 6px;
                background-color: #fafafa;
                border-radius: 3px;
                font-size: 11px;
            }

            .factor-name {
                color: #666;
                font-weight: 500;
            }

            .factor-impact {
                font-weight: 600;
                font-size: 10px;
            }

            .factor-impact.positive {
                color: #4caf50;
            }

            .factor-impact.negative {
                color: #f44336;
            }

            .price-trend-chart {
                background-color: #f9fdfc;
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 20px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                border: 1px solid #e0e0e0;
                position: relative;
            }

            .chart-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                flex-wrap: wrap;
                gap: 20px;
            }

            .chart-header h3 {
                margin: 0;
                color: #333;
                font-size: 18px;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .chart-legend {
                display: flex;
                gap: 15px;
                flex-wrap: wrap;
                padding: 10px 15px;
                background-color: rgba(255, 255, 255, 0.8);
                border-radius: 8px;
                border: 1px solid #e0e0e0;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            }

            .legend-item {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 13px;
                font-weight: 500;
                color: #666;
                padding: 5px 10px;
                border-radius: 6px;
                background-color: rgba(255, 255, 255, 0.6);
                transition: all 0.2s ease;
                border: 1px solid #f0f0f0;
            }

            .legend-item:hover {
                background-color: rgba(255, 255, 255, 0.9);
                transform: translateY(-1px);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }

            .legend-color {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                border: 2px solid white;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            }

            .chart-container {
                background-color: white;
                border-radius: 8px;
                padding: 20px;
                margin-bottom: 0;
                border: 1px solid #e0e0e0;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                position: relative;
            }

            .error-text {
                color: #f44336;
                font-weight: 500;
                margin: 0;
            }

            .no-data-placeholder {
                padding: '60px 20px';
                text-align: 'center';
                background-color: '#f9f9f9';
                border-radius: '8px';
                border: '2px dashed #ddd';
                color: #666;
            }

            .no-data-placeholder h3 {
                color: #666;
                margin-bottom: 15px;
            }

            .no-data-placeholder p {
                color: #999;
                font-size: 16px;
                line-height: 1.5;
            }

            /* Custom Chart Enhancements */
            .custom-chart-grid {
                stroke: rgba(76, 175, 80, 0.1);
                stroke-width: 1;
                stroke-dasharray: 3,3;
            }

            .custom-chart-axis {
                stroke: rgba(46, 125, 50, 0.3);
                stroke-width: 2;
            }

            .custom-tooltip {
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(248, 255, 254, 0.95)) !important;
                border: 2px solid rgba(76, 175, 80, 0.3) !important;
                border-radius: 12px !important;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1), 0 4px 15px rgba(76, 175, 80, 0.2) !important;
                backdrop-filter: blur(10px) !important;
                font-family: 'Poppins', sans-serif !important;
            }

            .custom-tooltip .recharts-tooltip-label {
                color: #1b5e20 !important;
                font-weight: 700 !important;
                font-size: 14px !important;
                margin-bottom: 8px !important;
                text-align: center !important;
                border-bottom: 1px solid rgba(76, 175, 80, 0.2) !important;
                padding-bottom: 5px !important;
            }

            .custom-tooltip .recharts-tooltip-item {
                color: #2e7d32 !important;
                font-weight: 600 !important;
                font-size: 13px !important;
                padding: 2px 0 !important;
            }

            .chart-loading-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(255, 255, 255, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 12px;
                z-index: 10;
            }

            .chart-loading-spinner {
                width: 30px;
                height: 30px;
                border: 3px solid #f0f0f0;
                border-top: 3px solid #4CAF50;
                border-radius: 50%;
                animation: chartSpin 1s linear infinite;
            }

            @keyframes chartSpin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            .chart-data-point {
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .chart-data-point:hover {
                filter: brightness(1.2) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
                transform: scale(1.1);
            }
        `}</style>

            <div className="market-container">
                {/* Crop Selection Panel */}
                <div className="crop-selection-panel">
                    <div className="selection-header">
                        <h3>Select Crops for Price Analysis</h3>
                        <button className="save-selection-btn" onClick={saveCurrentSelection}>
                            <FontAwesomeIcon icon={faSave} />
                            Save Selection
                        </button>
                    </div>

                    {/* Selection Summary */}
                    {selectedCrops.length > 0 && (
                        <div className="selection-summary">
                            <strong>{selectedCrops.length} crops selected:</strong> {selectedCrops.join(', ')}
                        </div>
                    )}

                    {/* API Parameters */}
                    <div className="api-parameters">
                        <h4>Price Prediction Parameters</h4>
                        <div className="parameter-controls">
                            <div className="parameter-group">
                                <label>Location:</label>
                                <select
                                    className="parameter-select"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                >
                                    {locations.map(loc => (
                                        <option key={loc} value={loc}>{loc}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="parameter-group">
                                <label>Prediction Period:</label>
                                <select
                                    className="parameter-select"
                                    value={weeks}
                                    onChange={(e) => setWeeks(parseInt(e.target.value))}
                                >
                                    <option value={4}>4 weeks (1 month)</option>
                                    <option value={8}>8 weeks (2 months)</option>
                                    <option value={12}>12 weeks (3 months)</option>
                                    <option value={16}>16 weeks (4 months)</option>
                                    <option value={24}>24 weeks (6 months)</option>
                                    <option value={52}>52 weeks (1 year)</option>
                                </select>
                            </div>

                            <button
                                className="fetch-prices-btn"
                                onClick={fetchPricePredictions}
                                disabled={isLoading || selectedCrops.length === 0}
                            >
                                {isLoading ? (
                                    <>🔄 Loading...</>
                                ) : (
                                    <>📊 Get Price Predictions</>
                                )}
                            </button>
                        </div>

                        {lastUpdated && (
                            <div className="last-updated">
                                Last updated: {lastUpdated.toLocaleString()}
                            </div>
                        )}
                    </div>

                    {/* Controls */}
                    <div className="selection-controls">
                        <input
                            type="text"
                            placeholder="Search crops..."
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        <select
                            className="category-select"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>

                        <div className="view-toggle">
                            <button
                                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                                onClick={() => setViewMode('grid')}
                            >
                                Grid
                            </button>
                            <button
                                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                                onClick={() => setViewMode('list')}
                            >
                                List
                            </button>
                        </div>

                        <div className="bulk-actions">
                            <button className="bulk-btn select-all" onClick={selectAllVisible}>
                                Select Visible ({filteredCrops.length})
                            </button>
                            <button className="bulk-btn deselect-all" onClick={deselectAll}>
                                Clear All
                            </button>
                        </div>
                    </div>

                    {/* Crops Display */}
                    {filteredCrops.length === 0 ? (
                        <div className="no-results">
                            <h3>No crops found</h3>
                            <p>Try adjusting your search term or category filter.</p>
                        </div>
                    ) : viewMode === 'grid' ? (
                        <div className="crop-grid">
                            {filteredCrops.map(crop => (
                                <div
                                    key={crop}
                                    className={`crop-checkbox ${selectedCrops.includes(crop) ? 'selected' : ''}`}
                                    onClick={() => toggleCropSelection(crop)}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedCrops.includes(crop)}
                                        onChange={() => { }} // Handled by div onClick
                                    />
                                    <div
                                        className="crop-color-indicator"
                                        style={{ backgroundColor: allCropsData[crop].color }}
                                    ></div>
                                    <div className="crop-info">
                                        <div className="crop-name">{crop}</div>
                                        <div className="crop-category">{allCropsData[crop].category}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        // Group by category for list view
                        <div className="crop-list-container">
                            {categories.filter(category =>
                                selectedCategory === category
                            ).map(category => {
                                const categoryyCrops = filteredCrops.filter(
                                    crop => allCropsData[crop].category === category
                                );

                                if (categoryyCrops.length === 0) return null;

                                return (
                                    <div key={category} className="category-section">
                                        <div className="category-header">
                                            <div className="category-title">{category} ({categoryyCrops.length})</div>
                                            <button
                                                className="category-select-btn"
                                                onClick={() => selectCategory(category)}
                                            >
                                                Select All
                                            </button>
                                        </div>
                                        <div className="crop-list">
                                            {categoryyCrops.map(crop => (
                                                <div
                                                    key={crop}
                                                    className={`crop-checkbox ${selectedCrops.includes(crop) ? 'selected' : ''}`}
                                                    onClick={() => toggleCropSelection(crop)}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedCrops.includes(crop)}
                                                        onChange={() => { }} // Handled by div onClick
                                                    />
                                                    <div
                                                        className="crop-color-indicator"
                                                        style={{ backgroundColor: allCropsData[crop].color }}
                                                    ></div>
                                                    <div className="crop-info">
                                                        <div className="crop-name">{crop}</div>
                                                        <div className="crop-category">{allCropsData[crop].season} • {allCropsData[crop].notes}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Saved Selections */}
                    {savedSelections.length > 0 && (
                        <div className="saved-selections">
                            <h4>Saved Selections</h4>
                            {savedSelections.map(selection => (
                                <div key={selection.id} className="saved-selection-item">
                                    <div className="selection-info">
                                        <strong>{selection.name}</strong>
                                        <div style={{ fontSize: '12px', color: '#666' }}>
                                            {selection.crops.length} crops • Created: {selection.createdAt}
                                        </div>
                                    </div>
                                    <div className="selection-actions">
                                        <button
                                            className="action-btn load-btn"
                                            onClick={() => loadSelection(selection)}
                                        >
                                            <FontAwesomeIcon icon={faEye} /> Load
                                        </button>
                                        <button
                                            className="action-btn delete-btn"
                                            onClick={() => deleteSelection(selection.id)}
                                        >
                                            × Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Price Trend Chart */}
                {selectedCrops.length > 0 && Object.keys(priceData).length > 0 && (
                    <div className="price-trend-chart">
                        <div className="chart-header">
                            <h3>Price Trends for {location}</h3>
                            <div className="chart-legend">
                                {selectedCrops.map(crop => (
                                    priceData[crop] && priceData[crop].weekly_predictions && (
                                        <div key={crop} className="legend-item">
                                            <div
                                                className="legend-color"
                                                style={{ backgroundColor: allCropsData[crop]?.color || '#666' }}
                                            ></div>
                                            <span>{crop}</span>
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>

                        <div className="chart-container">
                            {isLoading ? (
                                <div className="chart-loading-overlay">
                                    <div className="chart-loading-spinner"></div>
                                </div>
                            ) : null}
                            <ResponsiveContainer width="100%" height={500}>
                                <LineChart
                                    data={(() => {
                                        // Prepare data for the chart
                                        const maxWeeks = Math.max(...Object.values(priceData)
                                            .filter(data => data.weekly_predictions)
                                            .map(data => data.weekly_predictions.length)
                                        );

                                        const chartData = [];
                                        for (let i = 0; i < maxWeeks; i++) {
                                            const weekData = {
                                                week: i + 1,
                                                weekLabel: `Week ${i + 1}`
                                            };

                                            selectedCrops.forEach(crop => {
                                                if (priceData[crop] &&
                                                    priceData[crop].weekly_predictions &&
                                                    priceData[crop].weekly_predictions[i]) {
                                                    weekData[crop] = Math.round(priceData[crop].weekly_predictions[i].predicted_price);
                                                }
                                            });

                                            chartData.push(weekData);
                                        }

                                        return chartData;
                                    })()}
                                    margin={{ top: 30, right: 50, left: 90, bottom: 90 }}
                                >
                                    <defs>
                                        <linearGradient id="chartGridGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="rgba(76, 175, 80, 0.08)" />
                                            <stop offset="50%" stopColor="rgba(76, 175, 80, 0.03)" />
                                            <stop offset="100%" stopColor="rgba(76, 175, 80, 0.08)" />
                                        </linearGradient>
                                        {selectedCrops.map((crop, index) => (
                                            <linearGradient key={`gradient-${crop}`} id={`gradient-${crop}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                                <stop offset="0%" stopColor={allCropsData[crop]?.color || '#666'} stopOpacity={0.8} />
                                                <stop offset="100%" stopColor={allCropsData[crop]?.color || '#666'} stopOpacity={0.1} />
                                            </linearGradient>
                                        ))}
                                    </defs>
                                    <XAxis
                                        dataKey="week"
                                        axisLine={{ stroke: '#e0e0e0', strokeWidth: 2 }}
                                        tickLine={{ stroke: '#bdbdbd', strokeWidth: 1 }}
                                        tick={{
                                            fontSize: 12,
                                            fill: '#888',
                                            fontWeight: 500,
                                            fontFamily: 'Poppins'
                                        }}
                                        interval={0}
                                        angle={0}
                                        textAnchor="middle"
                                        height={70}
                                        label={{
                                            value: 'Prediction Period (Weeks)',
                                            position: 'insideBottom',
                                            offset: -45,
                                            style: {
                                                textAnchor: 'middle',
                                                fontSize: '14px',
                                                fontWeight: 600,
                                                fill: '#666',
                                                fontFamily: 'Poppins'
                                            }
                                        }}
                                    />
                                    <YAxis
                                        axisLine={{ stroke: '#e0e0e0', strokeWidth: 2 }}
                                        tickLine={{ stroke: '#bdbdbd', strokeWidth: 1 }}
                                        tick={{
                                            fontSize: 12,
                                            fill: '#888',
                                            fontWeight: 500,
                                            fontFamily: 'Poppins'
                                        }}
                                        width={85}
                                        label={{
                                            value: 'Price (Rs. per kg)',
                                            angle: -90,
                                            position: 'insideLeft',
                                            style: {
                                                textAnchor: 'middle',
                                                fontSize: '14px',
                                                fontWeight: 600,
                                                fill: '#666',
                                                fontFamily: 'Poppins'
                                            }
                                        }}
                                        tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                                        domain={['dataMin - 500', 'dataMax + 500']}
                                    />
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="rgba(0, 0, 0, 0.1)"
                                        strokeWidth={1}
                                    />
                                    <Tooltip
                                        formatter={(value, name) => [
                                            `Rs. ${value.toLocaleString()}`,
                                            name
                                        ]}
                                        labelFormatter={(week) => `Week ${week} Prediction`}
                                        contentStyle={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                            border: '1px solid #e0e0e0',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                            fontSize: '13px',
                                            fontFamily: 'Poppins'
                                        }}
                                        labelStyle={{
                                            fontWeight: 600,
                                            color: '#666',
                                            fontSize: '14px',
                                            marginBottom: '8px'
                                        }}
                                        itemStyle={{
                                            color: '#888',
                                            fontWeight: 500,
                                            fontSize: '13px',
                                            padding: '2px 0'
                                        }}
                                        cursor={{
                                            stroke: 'rgba(0, 0, 0, 0.1)',
                                            strokeWidth: 1,
                                            strokeDasharray: '3 3'
                                        }}
                                    />
                                    <Legend
                                        wrapperStyle={{
                                            paddingTop: '20px',
                                            fontFamily: 'Poppins',
                                            fontWeight: 500,
                                            color: '#666'
                                        }}
                                        iconType="line"
                                    />

                                    {selectedCrops.map((crop, index) => (
                                        priceData[crop] && priceData[crop].weekly_predictions && (
                                            <Line
                                                key={crop}
                                                type="monotone"
                                                dataKey={crop}
                                                stroke={allCropsData[crop]?.color || '#666'}
                                                strokeWidth={3}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                dot={{
                                                    fill: allCropsData[crop]?.color || '#666',
                                                    strokeWidth: 3,
                                                    r: 5,
                                                    stroke: '#fff',
                                                    className: 'chart-data-point'
                                                }}
                                                activeDot={{
                                                    r: 8,
                                                    stroke: allCropsData[crop]?.color || '#666',
                                                    strokeWidth: 3,
                                                    fill: '#fff',
                                                    className: 'chart-data-point'
                                                }}
                                                connectNulls={false}
                                                animationDuration={1000}
                                                animationEasing="ease-out"
                                            />
                                        )
                                    ))}
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {/* Price Analysis Section */}
                {selectedCrops.length > 0 ? (
                    <div className="price-chart">
                        <div className="chart-info">
                            <h3>Price Analysis for {location}</h3>
                            <div className="selected-count">
                                {selectedCrops.length} crops • {weeks} weeks prediction
                            </div>
                        </div>

                        {Object.keys(priceData).length > 0 ? (
                            <div className="price-results">
                                {selectedCrops.map(crop => {
                                    const cropPriceData = priceData[crop];

                                    if (!cropPriceData) {
                                        return (
                                            <div key={crop} className="crop-price-card loading">
                                                <h4>{crop}</h4>
                                                <p>Click "Get Price Predictions" to load data</p>
                                            </div>
                                        );
                                    }

                                    if (cropPriceData.error) {
                                        return (
                                            <div key={crop} className="crop-price-card error">
                                                <h4>{crop}</h4>
                                                <p className="error-text">❌ {cropPriceData.error}</p>
                                            </div>
                                        );
                                    }

                                    return (
                                        <div key={crop} className="crop-price-card success">
                                            <div className="crop-header">
                                                <h4>{crop}</h4>
                                                <div
                                                    className="crop-color-dot"
                                                    style={{ backgroundColor: allCropsData[crop]?.color || '#666' }}
                                                ></div>
                                            </div>

                                            <div className="price-summary">
                                                {cropPriceData.current_price && (
                                                    <div className="price-item">
                                                        <span className="price-label">Current Price:</span>
                                                        <span className="price-value">Rs. {cropPriceData.current_price.toLocaleString()}/kg</span>
                                                    </div>
                                                )}

                                                {cropPriceData.weekly_predictions && cropPriceData.weekly_predictions.length > 0 && (
                                                    <div className="price-item">
                                                        <span className="price-label">Week 1 Prediction:</span>
                                                        <span className="price-value">Rs. {Math.round(cropPriceData.weekly_predictions[0].predicted_price).toLocaleString()}/kg</span>
                                                    </div>
                                                )}

                                                {cropPriceData.weekly_predictions && cropPriceData.weekly_predictions.length > 0 && (
                                                    <div className="price-item">
                                                        <span className="price-label">Week 1 Change:</span>
                                                        <span className={`trend ${cropPriceData.weekly_predictions[0].price_change_percent >= 0 ? 'up' : 'down'}`}>
                                                            {cropPriceData.weekly_predictions[0].price_change_percent >= 0 ? '�' : '📉'}
                                                            {cropPriceData.weekly_predictions[0].price_change_percent.toFixed(2)}%
                                                        </span>
                                                    </div>
                                                )}

                                                {cropPriceData.weekly_predictions && cropPriceData.weekly_predictions.length > 0 && (
                                                    <div className="price-item">
                                                        <span className="price-label">Confidence Range:</span>
                                                        <span className="confidence">
                                                            Rs. {Math.round(cropPriceData.weekly_predictions[0].confidence_lower).toLocaleString()} -
                                                            Rs. {Math.round(cropPriceData.weekly_predictions[0].confidence_upper).toLocaleString()}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {cropPriceData.weekly_predictions && cropPriceData.weekly_predictions.length > 0 && (
                                                <div className="weekly-preview">
                                                    <h5>Weekly Predictions ({Math.min(4, cropPriceData.weekly_predictions.length)} weeks shown):</h5>
                                                    <div className="weekly-grid">
                                                        {cropPriceData.weekly_predictions.slice(0, 4).map((prediction, index) => (
                                                            <div key={index} className="week-item">
                                                                <div className="week-header">
                                                                    <span className="week-label">Week {prediction.week_number}:</span>
                                                                    <span className="week-price">Rs. {Math.round(prediction.predicted_price).toLocaleString()}</span>
                                                                </div>
                                                                <div className="week-details">
                                                                    <span className={`week-change ${prediction.price_change_percent >= 0 ? 'positive' : 'negative'}`}>
                                                                        {prediction.price_change_percent >= 0 ? '+' : ''}{prediction.price_change_percent.toFixed(1)}%
                                                                    </span>
                                                                    <span className="week-date">{prediction.date_start}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {cropPriceData.weekly_predictions.length > 4 && (
                                                        <div className="view-all-weeks">
                                                            <button
                                                                className="view-all-btn"
                                                                onClick={() => alert(`Full ${weeks}-week prediction data available. Consider adding a detailed view modal.`)}
                                                            >
                                                                View All {cropPriceData.weekly_predictions.length} Weeks
                                                            </button>
                                                        </div>
                                                    )}

                                                    {/* Market Factors for Week 1 */}
                                                    {cropPriceData.weekly_predictions[0]?.market_factors && (
                                                        <div className="market-factors">
                                                            <h6>Week 1 Market Factors:</h6>
                                                            <div className="factors-grid">
                                                                {Object.entries(cropPriceData.weekly_predictions[0].market_factors)
                                                                    .filter(([key, value]) => value !== 0)
                                                                    .map(([factor, impact]) => (
                                                                        <div key={factor} className="factor-item">
                                                                            <span className="factor-name">
                                                                                {factor.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                                                                            </span>
                                                                            <span className={`factor-impact ${impact > 0 ? 'positive' : 'negative'}`}>
                                                                                {impact > 0 ? '+' : ''}{impact.toFixed(2)}%
                                                                            </span>
                                                                        </div>
                                                                    ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="no-data-placeholder">
                                <h3>📊 Ready for Price Analysis</h3>
                                <p>
                                    Selected crops: <strong>{selectedCrops.join(', ')}</strong><br />
                                    Location: <strong>{location}</strong><br />
                                    Prediction period: <strong>{weeks} weeks</strong>
                                </p>
                                <p style={{ marginTop: '20px', color: '#2e7d32' }}>
                                    Click "Get Price Predictions" to fetch real-time market data and forecasts.
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                        <h3>🌾 Select Crops to Begin Analysis</h3>
                        <p>Choose crops from the selection panel above to view price trends and market insights.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MarketSection;
