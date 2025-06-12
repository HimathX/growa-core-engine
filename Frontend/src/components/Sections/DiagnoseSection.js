import React, { useState, useRef } from "react";
// import '../../App.css'; // Styles are in App.css

// Placeholder images (replace with actual URLs or local images if needed)
const BUTTERFLY_IMAGE_URL = "https://i.imgur.com/gL4YQLK.png"; // Simple butterfly PNG
const BEETLE_PLACEHOLDER_URL = "https://i.imgur.com/5v1zW7g.png"; // Placeholder bug
const MUSHROOM_PLACEHOLDER_URL = "https://i.imgur.com/kO7QeI7.png"; // Placeholder mushroom
const CATERPILLAR_PLACEHOLDER_URL = "https://i.imgur.com/tD19xG5.png"; // Placeholder caterpillar

const DiagnoseSection = ({ onBack }) => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [fromTheWeb, setFromTheWeb] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // For demo, we use a fixed butterfly image preview
        // In a real app, reader.result would be the uploaded image data URL
        setUploadedImage({
          preview: BUTTERFLY_IMAGE_URL, // Using the fixed butterfly URL
          name: file.name, // "insect.jpeg" or similar from mockup
          size: `${(file.size / 1024).toFixed(0)} KB`,
        });

        // Simulate analysis and populate with Lankan Thrip data
        console.log(`Image "${file.name}" uploaded. Simulating analysis.`);
        setAnalysisResult({
          confidence: "87%",
          ailmentName: "Lankan Thrip",
          description:
            "Biological insecticides such as the fungi Beauveria bassiana and Verticillium lecanii can kill thrips at all life-cycle stages. Insecticidal soap spray is effective against thrips.",
          suggestions: [
            "Lores ipsum dolor?",
            "How to get rid of larvae?",
            "Chemicals to get rid of Thrips",
            "Soap mix",
            "Biological insecticides",
          ],
        });
        setFromTheWeb({
          images: [
            { id: "beetle", src: BEETLE_PLACEHOLDER_URL, alt: "Beetle" },
            { id: "mushroom", src: MUSHROOM_PLACEHOLDER_URL, alt: "Mushroom" },
            {
              id: "caterpillar",
              src: CATERPILLAR_PLACEHOLDER_URL,
              alt: "Caterpillar",
            },
          ],
          title:
            "Thrips are minute (mostly 1 mm (0.04 in) long or less), slender insects with fringed wings and unique asymmetrical mouthparts. They fly only weakly and their feathery wings are unsuitable for conventional flight; instead, thrips exploit an unusual mechanism, clap and fling, to create lift using an unsteady circulation pattern with transient vortices near the wings.",
          fullText:
            "Thrips are a functionally diverse group; many of the known species are fungivorous. A small proportion of the species are serious pests of commercially important crops. Some of these serve as vectors for over 20 viruses that cause plant disease, especially the Tospoviruses. Many flower-dwelling species bring benefits as pollinators, with some predatory thrips feeding on small insects or mites. In the right conditions, such as in greenhouses, invasive species can exponentially increase in population size and form large swarms because of a lack of natural predators coupled with their ability to reproduce asexually, making them destructive to crops.",
        });
      };
      reader.readAsDataURL(file);
    } else {
      console.log("No valid image file selected.");
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
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
