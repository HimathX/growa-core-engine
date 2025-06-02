## 🔑 Core Features

### 🌾 Agricultural Decision Support

* **🦠 Infection Detector**
  Advanced image recognition model for disease identification. Farmers upload photos of infected crops for instant diagnosis. Model outputs include disease name, confidence rating, treatment strategy, and pathogen details. 
* **🐛 Insect Detector**
  Machine learning-based pest identification from crop images. Recognizes common agricultural pests and suggests targeted elimination strategies to prevent infestations. 
* **🌽 Crop Recommender**
  Intelligent recommendation engine analyzing plot size, soil type, location, and investment capacity. Integrates real-time weather 🌤️ and predicted market prices 💰 to suggest optimal crops for each season. 

### 🛠️ Farm Management Tools

* **🌱 Crop Progress Tracker**
  Interactive timeline mapping planting (D0) to harvest (D90+) with stage-specific alerts. Monitors growth milestones and sends notifications 🔔 for critical farm activities. 
* **💧 Smart Irrigation Control System**
  Automated irrigation based on real-time weather forecasts 🌦️, soil moisture sensors, and crop-specific evapotranspiration rates. Customizable thresholds reduce water costs by \~\$120 💵 per hectare annually while ensuring optimal crop hydration. 
* **🧮 Input Calculator**
  Calculates fertilizer and water requirements based on crop type and plot size (supports 0.25–5 acres). Helps farmers plan resource allocation and budget effectively. 

## 📈 Market Integration

* **📊 Price Prediction Engine**
  LSTM neural network forecasting 30-day market trends with ±8% accuracy. Visualizes comparative price graphs 📉 for multiple crops to optimize planting and selling decisions. 
* **🤝 Direct Buyer Network**
  Integrated directory connecting farmers to 45+ verified wholesale markets and export agencies. Reduces research time ⏱️ and improves market access for small-scale farmers. 
* **🚜 Yield Predictor**
  Advanced model estimating expected production per acre using crop type, soil data, historical yield trends, and environmental factors. Enables effective harvesting planning and market commitments. 

## 🛠️ Technical Implementation

### 🏗️ Architecture Overview

![System Architecture](docs/architecture.png)
*Three-tier microservices architecture with agricultural data pipeline and AI components.* 🧩

### 💻 Development Stack

| Component           | Technology                      |
| ------------------- | ------------------------------- |
| Frontend            | React JSX                       |
| Backend             | FastAPI                         |
| Machine Learning    | TensorFlow + OpenCV             |


### 🌐 External API Integration

* **OpenWeatherMap API**: Real-time 🌦️ and forecasted weather data for localized forecasts. 
* **Geocoding APIs**: Google Maps 🗺️ or Geoapify for converting addresses to coordinates and reverse lookup. 
* **OpenAI API**: Natural Language Processing 🤖 for the AI-powered chatbot. 
* **Central Bank of Sri Lanka**: Real-time vegetable price data 📈 for market intelligence. 

## 📚 Agricultural Data Sources

* **Soil Health Metrics**
  Department of Agriculture field reports (2015–2025 dataset). 
* **Cultivation Patterns**
  150+ farm survey responses from Central Province collected via field studies. 
* **Climate Data**
  Meteorological Department API providing hourly updates on temperature 🌡️, humidity 💧, and rainfall 🌧️. 
* **Pest & Disease Database**
  National Agricultural Information System (NAIS) records for pest and disease occurrences (2018–2025). 🦟 


## 👥 Core Team

* **Himath** (Team Lead & BackendDeveloper ) 🏅
* **Pankaja** (UI/UX Designer & Frontend Developer) 🎨
* **Haren** (Frontend Developer & ML Modal Developer) 💾
* **Sithija** (Frontend Developer & DevOps Manager) 🚀

*Supported by Sri Lanka Agritech Innovation Fund 2025* 🌾
