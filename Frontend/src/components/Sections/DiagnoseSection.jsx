import React, { useState, useRef } from 'react';

// Placeholder images (replace with actual URLs or local images if needed)
const BUTTERFLY_IMAGE_URL = "https://i.imgur.com/gL4YQLK.png"; // Simple butterfly PNG
const BEETLE_PLACEHOLDER_URL = "https://i.imgur.com/5v1zW7g.png"; // Placeholder bug
const MUSHROOM_PLACEHOLDER_URL = "https://i.imgur.com/kO7QeI7.png"; // Placeholder mushroom
const CATERPILLAR_PLACEHOLDER_URL = "https://i.imgur.com/tD19xG5.png"; // Placeholder caterpillar

const DiagnoseSection = ({ onBack }) => {
    // React state variables
    const [uploadedImage, setUploadedImage] = useState(null);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [fromTheWeb, setFromTheWeb] = useState(null);
    const fileInputRef = useRef(null);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                // Set uploaded image with actual preview
                setUploadedImage({
                    preview: reader.result, // Use actual uploaded image
                    name: file.name,
                    size: `${(file.size / 1024).toFixed(0)} KB`,
                });

                // Simulate analysis delay and populate with Lankan Thrip data
                console.log(`Image "${file.name}" uploaded. Simulating analysis.`);

                // Simulate processing delay
                setTimeout(() => {
                    setAnalysisResult({
                        confidence: "87%",
                        ailmentName: "Lankan Thrip",
                        description:
                            "Biological insecticides such as the fungi Beauveria bassiana and Verticillium lecanii can kill thrips at all life-cycle stages. Insecticidal soap spray is effective against thrips.",
                        suggestions: [
                            "How to identify thrip damage?",
                            "How to get rid of larvae?",
                            "Chemicals to get rid of Thrips",
                            "Natural soap mix solutions",
                            "Biological insecticides guide",
                        ],
                    });

                    setFromTheWeb({
                        images: [
                            { id: "beetle", src: "https://royalbrinkman.com/content/files/webshop-com/other/trips%20560x370.jpg", alt: "Beetle" },
                            { id: "mushroom", src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPeWDv3ukpyLSZkX1Y83Oe9cviR8iYIRpKVg&s", alt: "Mushroom" },
                            {
                                id: "caterpillar",
                                src: "data:image/jphttps://www.google.com/imgres?q=lankan%20thrip&imgurl=http%3A%2F%2Fwww.knowledgebank.irri.org%2Fimages%2Fstories%2Ffactsheet-thrips.jpg&imgrefurl=http%3A%2F%2Fwww.knowledgebank.irri.org%2Ftraining%2Ffact-sheets%2Fpest-management%2Finsects%2Fitem%2Frice-thrips&docid=HtZJgOyg7npUjM&tbnid=3OT9NfQACynf-M&vet=12ahUKEwjfobeGrMuOAxWMb_UHHdcWJV0QM3oECB0QAA..i&w=640&h=488&hcb=2&ved=2ahUKEwjfobeGrMuOAxWMb_UHHdcWJV0QM3oECB0QAAeg;base64,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",
                                alt: "Caterpillar",
                            },
                        ],
                        title:
                            "Thrips are minute (mostly 1 mm (0.04 in) long or less), slender insects with fringed wings and unique asymmetrical mouthparts. They fly only weakly and their feathery wings are unsuitable for conventional flight.",
                        fullText:
                            "Thrips are a functionally diverse group; many of the known species are fungivorous. A small proportion of the species are serious pests of commercially important crops. Some of these serve as vectors for over 20 viruses that cause plant disease, especially the Tospoviruses. Many flower-dwelling species bring benefits as pollinators, with some predatory thrips feeding on small insects or mites.",
                    });
                }, 1000); // 1 second delay to simulate processing
            };
            reader.readAsDataURL(file);
        } else {
            console.log("No valid image file selected.");
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

    return (
        <div className="diagnose-section-container">
            <div className="diagnose-top-panels">
                {/* Upload Panel */}
                <div className="diagnose-upload-panel">
                    <h3 className="diagnose-panel-title">
                        Upload a Picture <span className="ai-tag-diagnose">AI</span>
                    </h3>
                    {!uploadedImage ? (
                        <div className="upload-box" onClick={triggerFileInput}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                ref={fileInputRef}
                                style={{ display: "none" }}
                            />
                            <div className="upload-box-icon">
                                {" "}
                                {/* Placeholder for icon if any */}
                                {/* You can add an SVG icon here */}
                            </div>
                            <p>Drag & drop an image</p>
                            <span>Max 5 MB</span>
                            <button className="upload-button-diagnose">Upload</button>
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
                </div>

                {/* Infection Details Panel */}
                <div className="diagnose-details-panel">
                    <h3 className="diagnose-panel-title">Infection Details</h3>
                    <div className="infection-details-card">
                        {analysisResult ? (
                            <>
                                <p className="confidence-text">
                                    {analysisResult.confidence} Confidence
                                </p>
                                <h2 className="ailment-name">{analysisResult.ailmentName}</h2>
                                <p className="ailment-description">
                                    {analysisResult.description}
                                </p>
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
                                <h2 className="ailment-name-placeholder">Ailment</h2>
                                <p className="ailment-description-placeholder">Description</p>
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
                    <h3 className="diagnose-panel-title">From The Web</h3>
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
                {fromTheWeb ? (
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
                        <p>Upload an image to see pest/infection details</p>
                    </div>
                )}
            </div>
            {/* Back button, styled differently or removed if Diagnose is a main nav item */}
            {/* <button className="back-button" onClick={onBack}>Back to Dashboard</button> */}
        </div>
    );
};

export default DiagnoseSection;