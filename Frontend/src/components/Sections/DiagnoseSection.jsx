import React, { useState, useRef } from 'react';
import { getApiBaseUrl, API_CONFIG } from '../../config/api';

// Add CSS styles for loading and error states
const styles = `
.analyzing-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    text-align: center;
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #4CAF50;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.analyzing-text {
    font-size: 1.1rem;
    font-weight: 600;
    color: #333;
    margin: 0.5rem 0;
}

.analyzing-subtext {
    font-size: 0.9rem;
    color: #666;
    margin: 0;
}

.error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    text-align: center;
}

.error-text {
    font-size: 1.1rem;
    font-weight: 600;
    color: #e74c3c;
    margin: 0.5rem 0;
}

.error-description {
    font-size: 0.9rem;
    color: #666;
    margin: 0.5rem 0 1rem 0;
}

.retry-button {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
}

.retry-button:hover {
    background-color: #45a049;
}

.detection-type {
    font-size: 0.9rem;
    color: #666;
    font-style: italic;
    margin: -0.5rem 0 1rem 0;
}

.model-used {
    font-size: 0.8rem;
    color: #4CAF50;
    font-weight: 600;
    margin: 0.5rem 0;
    padding: 0.25rem 0.5rem;
    background-color: #f0f8f0;
    border-radius: 4px;
    border-left: 3px solid #4CAF50;
}

.alternative-results {
    margin: 1rem 0;
    padding: 0.75rem;
    background-color: #f8f9fa;
    border-radius: 6px;
    border: 1px solid #e9ecef;
}

.alternative-results h4 {
    margin: 0 0 0.5rem 0;
    font-size: 0.9rem;
    color: #666;
}

.alternative-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0.25rem 0;
    font-size: 0.85rem;
}

.alt-type {
    font-weight: 600;
    color: #2196F3;
}

.alt-name {
    color: #333;
}

.alt-confidence {
    color: #666;
    font-size: 0.8rem;
}

.upload-box.disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.upload-box.drag-over {
    border-color: #4CAF50;
    background-color: #f0f8f0;
    transform: scale(1.02);
}

.upload-button-diagnose:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.from-the-web-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    text-align: center;
}

.from-the-web-loading .loading-spinner {
    width: 30px;
    height: 30px;
    border-width: 3px;
}

.from-the-web-loading p {
    font-size: 0.9rem;
    color: #666;
    margin: 0;
}

.detection-mode-selector {
    margin: 1rem 0;
    padding: 1rem;
    background-color: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #e9ecef;
}

.detection-mode-title {
    font-size: 0.9rem;
    font-weight: 600;
    color: #333;
    margin: 0 0 0.75rem 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.detection-mode-options {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.detection-mode-option {
    flex: 1;
    min-width: 120px;
    padding: 0.75rem;
    border: 2px solid #e9ecef;
    border-radius: 6px;
    background-color: white;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: center;
    font-size: 0.85rem;
}

.detection-mode-option:hover {
    border-color: #4CAF50;
    background-color: #f0f8f0;
}

.detection-mode-option.selected {
    border-color: #4CAF50;
    background-color: #4CAF50;
    color: white;
}

.detection-mode-option.disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: #f5f5f5;
}

.detection-mode-option.disabled:hover {
    border-color: #e9ecef;
    background-color: #f5f5f5;
}

.detection-mode-label {
    font-weight: 600;
    margin: 0 0 0.25rem 0;
}

.detection-mode-description {
    font-size: 0.75rem;
    opacity: 0.8;
    margin: 0;
}

.detection-icon {
    font-size: 1.2rem;
    margin-right: 0.25rem;
}
`;


if (typeof document !== 'undefined') {
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    if (!document.head.querySelector('style[data-diagnose-styles]')) {
        styleElement.setAttribute('data-diagnose-styles', 'true');
        document.head.appendChild(styleElement);
    }
}

const DiagnoseSection = ({ onBack }) => {

    const [uploadedImage, setUploadedImage] = useState(null);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [fromTheWeb, setFromTheWeb] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [detectionMode, setDetectionMode] = useState('auto');
    const fileInputRef = useRef(null);

    const callPestDetectionAPI = async (file) => {
        console.log("Calling Pest Detection API with file:", file.name, file.type, file.size);

        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${getApiBaseUrl()}${API_CONFIG.ENDPOINTS.PEST_DETECTION}`, {
            method: 'POST',
            body: formData,
        });

        console.log("Pest API response status:", response.status, response.statusText);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Pest API error response:", errorText);
            throw new Error(`Pest detection failed (${response.status}): ${response.statusText}. ${errorText}`);
        }

        const result = await response.json();
        console.log("Pest API result:", result);
        return result;
    };

    const callInsectDetectionAPI = async (file) => {
        console.log("Calling Insect Detection API with file:", file.name, file.type, file.size);

        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${getApiBaseUrl()}${API_CONFIG.ENDPOINTS.INSECT_DETECTION}`, {
            method: 'POST',
            body: formData,
        });

        console.log("Insect API response status:", response.status, response.statusText);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Insect API error response:", errorText);
            throw new Error(`Insect detection failed (${response.status}): ${response.statusText}. ${errorText}`);
        }

        const result = await response.json();
        console.log("Insect API result:", result);
        return result;
    };

    const analyzeImage = async (file, selectedMode = null) => {
        setIsAnalyzing(true);
        setError(null);

        const mode = selectedMode || detectionMode;

        try {
            console.log(`Analyzing image "${file.name}" using detection mode: ${mode}`);

            let finalResult = null;
            let resultType = null;
            let pestConfidence = 0;
            let insectConfidence = 0;
            let pestResult = null;
            let insectResult = null;

            if (mode === 'pest') {
                // Only call pest detection API
                console.log('Running pest detection only...');
                try {
                    const result = await callPestDetectionAPI(file);
                    pestResult = { status: 'fulfilled', value: result };
                    if (result.status === 'success' || result.plant_disease || result.confidence) {
                        pestConfidence = result.confidence || 0;
                        finalResult = result;
                        resultType = 'pest';
                        console.log('Pest detection completed with confidence:', pestConfidence);
                    } else {
                        // Even if status isn't "success", try to use the result if it has content
                        pestConfidence = result.confidence || 0;
                        finalResult = result;
                        resultType = 'pest';
                        console.log('Pest detection completed (status unclear) with confidence:', pestConfidence);
                    }
                } catch (error) {
                    console.error('Pest detection error:', error);
                    throw new Error(`Pest detection failed: ${error.message}`);
                }
            } else if (mode === 'insect') {
                // Only call insect detection API
                console.log('Running insect detection only...');
                try {
                    const result = await callInsectDetectionAPI(file);
                    insectResult = { status: 'fulfilled', value: result };
                    const insectData = result;
                    if (insectData.predictions && insectData.predictions.length > 0) {
                        insectConfidence = insectData.predictions[0].confidence || 0;
                    } else if (insectData.confidence) {
                        insectConfidence = insectData.confidence;
                    }
                    finalResult = result;
                    resultType = 'insect';
                    console.log('Insect detection completed with confidence:', insectConfidence);
                } catch (error) {
                    console.error('Insect detection error:', error);
                    throw new Error(`Insect detection failed: ${error.message}`);
                }
            } else {
                // Auto mode - call both APIs in parallel and choose best result
                console.log('Running auto detection (both models)...');
                const [pestRes, insectRes] = await Promise.allSettled([
                    callPestDetectionAPI(file),
                    callInsectDetectionAPI(file)
                ]);

                pestResult = pestRes;
                insectResult = insectRes;

                // Extract confidence scores
                if (pestRes.status === 'fulfilled' && (pestRes.value.status === 'success' || pestRes.value.plant_disease || pestRes.value.confidence)) {
                    pestConfidence = pestRes.value.confidence || 0;
                    console.log('Pest detection successful with confidence:', pestConfidence);
                } else {
                    console.log('Pest detection failed:', pestRes.reason?.message || 'Unknown error');
                }

                if (insectRes.status === 'fulfilled') {
                    // Handle different insect API response formats
                    const insectData = insectRes.value;
                    if (insectData.predictions && insectData.predictions.length > 0) {
                        insectConfidence = insectData.predictions[0].confidence || 0;
                    } else if (insectData.confidence) {
                        insectConfidence = insectData.confidence;
                    }
                    console.log('Insect detection successful with confidence:', insectConfidence);
                } else {
                    console.log('Insect detection failed:', insectRes.reason?.message || 'Unknown error');
                }

                // Choose the result with higher confidence (no minimum threshold - always show best result)

                if (pestRes.status === 'fulfilled' && (pestRes.value.status === 'success' || pestRes.value.plant_disease || pestRes.value.confidence) &&
                    insectRes.status === 'fulfilled') {
                    // Both models succeeded, choose the one with higher confidence
                    if (pestConfidence >= insectConfidence) {
                        finalResult = pestRes.value;
                        resultType = 'pest';
                        console.log(`Choosing pest detection (confidence: ${pestConfidence} vs ${insectConfidence})`);
                    } else {
                        finalResult = insectRes.value;
                        resultType = 'insect';
                        console.log(`Choosing insect detection (confidence: ${insectConfidence} vs ${pestConfidence})`);
                    }
                } else if (pestRes.status === 'fulfilled' && (pestRes.value.status === 'success' || pestRes.value.plant_disease || pestRes.value.confidence)) {
                    // Only pest model succeeded
                    finalResult = pestRes.value;
                    resultType = 'pest';
                    console.log(`Using pest detection (confidence: ${pestConfidence})`);
                } else if (insectRes.status === 'fulfilled') {
                    // Only insect model succeeded
                    finalResult = insectRes.value;
                    resultType = 'insect';
                    console.log(`Using insect detection (confidence: ${insectConfidence})`);
                } else {
                    throw new Error('Both detection APIs failed');
                }
            }

            // Format the result for display
            const formattedResult = formatDetectionResult(
                finalResult,
                resultType,
                { pestConfidence, insectConfidence, pestResult, insectResult, detectionMode: mode }
            );
            setAnalysisResult(formattedResult);

            // Set placeholder web information (this could be enhanced with real web scraping)
            setFromTheWeb(generateWebInfo(formattedResult.ailmentName));

        } catch (error) {
            console.error('Analysis error:', error);
            setError(error.message);
            setAnalysisResult(null);
            setFromTheWeb(null);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const formatDetectionResult = (result, type, additionalInfo = {}) => {
        const { pestConfidence = 0, insectConfidence = 0, pestResult, insectResult, detectionMode = 'auto' } = additionalInfo;

        let alternativeResults = [];

        // Only show alternative results in auto mode when we actually ran both models
        if (detectionMode === 'auto') {
            if (type === 'pest' && insectConfidence > 0.1) { // Lowered threshold to show more alternatives
                const insectData = insectResult?.value;
                if (insectData?.predictions?.[0]) {
                    alternativeResults.push({
                        type: 'Insect',
                        name: insectData.predictions[0].class || 'Detected Insect Species',
                        confidence: (insectData.predictions[0].confidence * 100).toFixed(0) + '%'
                    });
                }
            } else if (type === 'insect' && pestConfidence > 0.1) { // Lowered threshold to show more alternatives
                const pestData = pestResult?.value;
                if (pestData?.plant_disease) {
                    alternativeResults.push({
                        type: 'Disease/Pest',
                        name: pestData.plant_disease,
                        confidence: (pestData.confidence * 100).toFixed(0) + '%'
                    });
                }
            }
        }

        // Determine model used text based on detection mode
        let modelUsedText = '';
        if (detectionMode === 'auto') {
            modelUsedText = `Auto Detection → ${type === 'pest' ? 'Disease/Pest' : 'Insect'} Model (${(result.confidence || result.predictions?.[0]?.confidence || 0) * 100}% confidence)`;
        } else if (detectionMode === 'pest') {
            modelUsedText = `Disease/Pest Model (Manual Selection, ${(result.confidence * 100).toFixed(0)}% confidence)`;
        } else if (detectionMode === 'insect') {
            const confidence = result.predictions?.[0]?.confidence || result.confidence || 0;
            modelUsedText = `Insect Model (Manual Selection, ${(confidence * 100).toFixed(0)}% confidence)`;
        }

        if (type === 'pest') {
            return {
                confidence: `${(result.confidence * 100).toFixed(0)}%`,
                ailmentName: result.plant_disease || 'Plant Health Issue Detected',
                description: result.remedy || 'Plant health issue detected. Consider consulting with agricultural experts for specific treatment recommendations.',
                suggestions: [
                    "How to identify this disease?",
                    "What causes this condition?",
                    "Prevention methods",
                    "Treatment options",
                    "When to seek expert help",
                ],
                detectionType: 'Disease/Pest',
                alternativeResults,
                modelUsed: modelUsedText
            };
        } else {
            // For insect detection
            const topPrediction = result.predictions?.[0] || result;
            return {
                confidence: `${(topPrediction.confidence * 100).toFixed(0)}%`,
                ailmentName: topPrediction.class || topPrediction.insect_class || 'Insect Species Detected',
                description: `Insect species detected with ${(topPrediction.confidence * 100).toFixed(0)}% confidence. This insect may affect your crops and should be monitored.`,
                suggestions: [
                    "Is this insect harmful to crops?",
                    "How to control this insect?",
                    "Natural predators and control",
                    "Chemical control methods",
                    "Integrated pest management",
                ],
                detectionType: 'Insect',
                alternativeResults,
                modelUsed: modelUsedText
            };
        }
    };

    const generateWebInfo = (ailmentName) => {

        return {
            images: [
                { id: "example1", src: "https://via.placeholder.com/150x100?text=Example+1", alt: "Example 1" },
                { id: "example2", src: "https://via.placeholder.com/150x100?text=Example+2", alt: "Example 2" },
                { id: "example3", src: "https://via.placeholder.com/150x100?text=Example+3", alt: "Example 3" },
            ],
            title: `${ailmentName} - Additional Information`,
            fullText: `Learn more about ${ailmentName} and effective management strategies. Consult with agricultural experts for detailed treatment plans and prevention methods.`,
        };
    };

    const processFile = (file) => {
        if (!file) {
            console.log("No file provided.");
            return;
        }

        console.log("File selected:", file.name, "Type:", file.type, "Size:", file.size);


        const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        const isValidType = supportedTypes.includes(file.type.toLowerCase()) || file.type.startsWith("image/");

        if (!isValidType) {
            const error = `Unsupported file type: ${file.type}. Please select a JPG, PNG, GIF, or WebP image.`;
            console.error(error);
            setError(error);
            return;
        }

        // Check file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            const error = `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum size is 5MB.`;
            console.error(error);
            setError(error);
            return;
        }


        setError(null);

        const reader = new FileReader();
        reader.onloadend = () => {

            setUploadedImage({
                preview: reader.result,
                name: file.name,
                size: `${(file.size / 1024).toFixed(0)} KB`,
                file: file,
            });

            console.log("Image preview created successfully for:", file.name);


            analyzeImage(file);
        };

        reader.onerror = () => {
            const error = "Error reading file. Please try again.";
            console.error("FileReader error:", reader.error);
            setError(error);
        };

        reader.readAsDataURL(file);
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        processFile(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        if (!isAnalyzing) {
            setIsDragOver(true);
        }
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);

        if (isAnalyzing) return;

        const files = e.dataTransfer.files;
        if (files && files[0]) {
            processFile(files[0]);
        }
    };

    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleRemoveImage = () => {
        setUploadedImage(null);
        setAnalysisResult(null);
        setFromTheWeb(null);
        setError(null);
        setIsAnalyzing(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Reset file input
        }
        console.log("Uploaded image removed.");
    };

    const handleSuggestionClick = (suggestion) => {
        console.log(`Suggestion clicked: ${suggestion}`);
    };

    const handleAskGrowBuddy = () => {
        console.log("Ask Grow Buddy clicked from Diagnose section.");
        // Potentially navigate to GrowBuddyAISection with context
    };

    const handleFromTheWebLink = () => {
        console.log("From The Web external link clicked.");
    };

    const handleDetectionModeChange = (mode) => {
        console.log(`Detection mode changed to: ${mode}`);
        setDetectionMode(mode);

        // If we have an uploaded image and are not currently analyzing, re-analyze with new mode
        if (uploadedImage?.file && !isAnalyzing) {
            console.log(`Re-analyzing image with new detection mode: ${mode}`);
            analyzeImage(uploadedImage.file, mode);
        }
    };

    return (
        <div className="diagnose-section-container">
            <div className="diagnose-top-panels">
                {/* Upload Panel */}
                <div className="diagnose-upload-panel">
                    <h3 className="diagnose-panel-title">
                        Upload a Picture <span className="ai-tag-diagnose">AI</span>
                    </h3>
                    {!uploadedImage ? (
                        <div
                            className={`upload-box ${isAnalyzing ? 'disabled' : ''} ${isDragOver ? 'drag-over' : ''}`}
                            onClick={!isAnalyzing ? triggerFileInput : undefined}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <input
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,.jpg,.jpeg,.png,.gif,.webp"
                                onChange={handleImageUpload}
                                ref={fileInputRef}
                                style={{ display: "none" }}
                                disabled={isAnalyzing}
                            />
                            <div className="upload-box-icon">
                                📸
                            </div>
                            <p>{isDragOver ? 'Drop image here' : 'Drag & drop an image (JPG, PNG, GIF, WebP)'}</p>
                            <span>Max 5 MB</span>
                            <button className="upload-button-diagnose" disabled={isAnalyzing}>
                                {isAnalyzing ? 'Analyzing...' : 'Upload'}
                            </button>
                        </div>
                    ) : (
                        <div className="image-preview-area-diagnose">
                            <button
                                className="remove-image-button"
                                onClick={handleRemoveImage}
                            >
                                ×
                            </button>
                            <img
                                src={uploadedImage.preview}
                                alt={uploadedImage.name}
                                className="uploaded-image-preview-diagnose"
                            />
                            <p className="image-name-diagnose">{uploadedImage.name}</p>
                            <p className="image-size-diagnose">{uploadedImage.size}</p>
                        </div>
                    )}

                    {/* Detection Mode Selector */}
                    <div className="detection-mode-selector">
                        <div className="detection-mode-title">
                            <span className="detection-icon">🔍</span>
                            Detection Method
                        </div>
                        <div className="detection-mode-options">
                            <div
                                className={`detection-mode-option ${detectionMode === 'auto' ? 'selected' : ''} ${isAnalyzing ? 'disabled' : ''}`}
                                onClick={() => !isAnalyzing && handleDetectionModeChange('auto')}
                            >
                                <div className="detection-mode-label">🤖 Smart Auto</div>
                                <div className="detection-mode-description">AI chooses best model</div>
                            </div>
                            <div
                                className={`detection-mode-option ${detectionMode === 'pest' ? 'selected' : ''} ${isAnalyzing ? 'disabled' : ''}`}
                                onClick={() => !isAnalyzing && handleDetectionModeChange('pest')}
                            >
                                <div className="detection-mode-label">🦠 Disease/Pest</div>
                                <div className="detection-mode-description">Focus on plant diseases</div>
                            </div>
                            <div
                                className={`detection-mode-option ${detectionMode === 'insect' ? 'selected' : ''} ${isAnalyzing ? 'disabled' : ''}`}
                                onClick={() => !isAnalyzing && handleDetectionModeChange('insect')}
                            >
                                <div className="detection-mode-label">🐛 Insect</div>
                                <div className="detection-mode-description">Focus on insect species</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Infection Details Panel */}
                <div className="diagnose-details-panel">
                    <h3 className="diagnose-panel-title">Detection Results</h3>
                    <div className="infection-details-card">
                        {isAnalyzing ? (
                            <div className="analyzing-state">
                                <div className="loading-spinner"></div>
                                <p className="analyzing-text">Analyzing image with AI...</p>
                                <p className="analyzing-subtext">This may take a few moments</p>
                            </div>
                        ) : error ? (
                            <div className="error-state">
                                <p className="error-text">⚠️ Analysis Failed</p>
                                <p className="error-description">{error}</p>
                                <button
                                    onClick={() => uploadedImage?.file && analyzeImage(uploadedImage.file)}
                                    className="retry-button"
                                >
                                    Try Again
                                </button>
                            </div>
                        ) : analysisResult ? (
                            <>
                                <p className="confidence-text">
                                    {analysisResult.confidence} Confidence
                                </p>
                                <h2 className="ailment-name">{analysisResult.ailmentName}</h2>
                                <p className="detection-type">{analysisResult.detectionType}</p>
                                <p className="model-used">{analysisResult.modelUsed}</p>
                                <p className="ailment-description">
                                    {analysisResult.description}
                                </p>

                                {/* Show alternative results if available */}
                                {analysisResult.alternativeResults && analysisResult.alternativeResults.length > 0 && (
                                    <div className="alternative-results">
                                        <h4>Alternative Detection:</h4>
                                        {analysisResult.alternativeResults.map((alt, index) => (
                                            <div key={index} className="alternative-item">
                                                <span className="alt-type">{alt.type}:</span>
                                                <span className="alt-name">{alt.name}</span>
                                                <span className="alt-confidence">({alt.confidence})</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="suggestion-buttons-diagnose">
                                    {analysisResult.suggestions.map((suggestion, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleSuggestionClick(suggestion)}
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                                    <button
                                        onClick={handleAskGrowBuddy}
                                        className="ask-grow-buddy-button"
                                    >
                                        <span role="img" aria-label="chat bubble">
                                            💬
                                        </span>{" "}
                                        Ask Grow Buddy
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <p className="confidence-text-placeholder">Confidence</p>
                                <h2 className="ailment-name-placeholder">Upload an image to start detection</h2>
                                <p className="ailment-description-placeholder">Our AI will analyze your plant image for pests, diseases, and insects</p>
                                <div className="suggestion-buttons-diagnose placeholder">
                                    <button>How do I use this tool?</button>
                                    <button>How accurate are these results?</button>
                                    <button className="ask-grow-buddy-button">
                                        <span role="img" aria-label="chat bubble">
                                            💬
                                        </span>{" "}
                                        Ask Grow Buddy
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* From The Web Panel */}
            <div className="diagnose-from-the-web-panel">
                <div className="from-the-web-header">
                    <h3 className="diagnose-panel-title">Additional Information</h3>
                    {fromTheWeb && (
                        <button
                            className="external-link-button"
                            onClick={handleFromTheWebLink}
                            title="Open in new tab"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"
                                />
                                <path
                                    fillRule="evenodd"
                                    d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"
                                />
                            </svg>
                        </button>
                    )}
                </div>
                {isAnalyzing ? (
                    <div className="from-the-web-loading">
                        <div className="loading-spinner"></div>
                        <p>Gathering additional information...</p>
                    </div>
                ) : fromTheWeb ? (
                    <div className="web-info-card">
                        <div className="web-info-left">
                            <div className="web-info-images">
                                {fromTheWeb.images.map((img) => (
                                    <img
                                        key={img.id}
                                        src={img.src}
                                        alt={img.alt}
                                        className="web-thumbnail"
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="web-info-right">
                            <p>{fromTheWeb.title}</p>
                            <p>{fromTheWeb.fullText}</p>
                        </div>
                    </div>
                ) : (
                    <div className="from-the-web-placeholder">
                        <svg
                            width="80"
                            height="80"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ color: "#ccc", opacity: 0.7 }}
                        >
                            <path
                                d="M15.0007 12C15.0007 13.6569 13.6576 15 12.0007 15C10.3439 15 9.00073 13.6569 9.00073 12C9.00073 10.3431 10.3439 9 12.0007 9C13.6576 9 15.0007 10.3431 15.0007 12Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M12.0012 5C7.52354 5 3.73326 7.94288 2.45898 12C3.73326 16.0571 7.52354 19 12.0012 19C16.4788 19 20.2691 16.0571 21.5434 12C20.2691 7.94288 16.4788 5 12.0012 5Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <p>Upload an image to see additional information about detected issues</p>
                    </div>
                )}
            </div>
            {/* Back button, styled differently or removed if Diagnose is a main nav item */}
            {/* <button className="back-button" onClick={onBack}>Back to Dashboard</button> */}
        </div>
    );
};

export default DiagnoseSection;