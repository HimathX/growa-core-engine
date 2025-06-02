## Core Features

### Agricultural Decision Support

* **Infection Detector**
  Advanced image recognition model for disease identification. Farmers upload photos of infected crops for instant diagnosis. Model outputs include disease name, confidence rating, treatment strategy, and pathogen details.\[1]
* **Insect Detector**
  Machine learning-based pest identification from crop images. Recognizes common agricultural pests and suggests targeted elimination strategies to prevent infestations.\[1]
* **Crop Recommender**
  Intelligent recommendation engine analyzing plot size, soil type, location, and investment capacity. Integrates real-time weather and predicted market prices to suggest optimal crops for each season.\[2]

### Farm Management Tools

* **Crop Progress Tracker**
  Interactive timeline mapping planting (D0) to harvest (D90+) with stage-specific alerts. Monitors growth milestones and sends notifications for critical farm activities.\[3]
* **Smart Irrigation Control System**
  Automated irrigation based on real-time weather forecasts, soil moisture sensors, and crop-specific evapotranspiration rates. Customizable thresholds reduce water costs by \~\$120 per hectare annually while ensuring optimal crop hydration.\[4]
* **Input Calculator**
  Calculates fertilizer and water requirements based on crop type and plot size (supports 0.25–5 acres). Helps farmers plan resource allocation and budget effectively.\[3]

## Market Integration

* **Price Prediction Engine**
  LSTM neural network forecasting 30-day market trends with ±8% accuracy. Visualizes comparative price graphs for multiple crops to optimize planting and selling decisions.\[5]
* **Direct Buyer Network**
  Integrated directory connecting farmers to 45+ verified wholesale markets and export agencies. Reduces research time and improves market access for small-scale farmers.\[6]
* **Yield Predictor**
  Advanced model estimating expected production per acre using crop type, soil data, historical yield trends, and environmental factors. Enables effective harvesting planning and market commitments.\[2]

## Technical Implementation

### Architecture Overview

![System Architecture](docs/architecture.png)
*Three-tier microservices architecture with agricultural data pipeline and AI components.*

### Development Stack

| Component           | Technology                      |
| ------------------- | ------------------------------- |
| Frontend            | React PWA + LeafletJS           |
| Backend             | FastAPI + PostgreSQL + SQLModel |
| Machine Learning    | TensorFlow + OpenCV             |
| Infrastructure      | Docker + AWS EC2 + RDS          |
| Geospatial Services | PostGIS + Geocoding APIs        |

### External API Integration

* **OpenWeatherMap API**: Real-time and forecasted weather data for localized forecasts.\[7]
* **Geocoding APIs**: Google Maps or Geoapify for converting addresses to coordinates and reverse lookup.\[7]
* **OpenAI API**: Natural Language Processing for the AI-powered chatbot.\[8]
* **Central Bank of Sri Lanka**: Real-time vegetable price data for market intelligence.\[9]

## Agricultural Data Sources

* **Soil Health Metrics**
  Department of Agriculture field reports (2015–2025 dataset).\[10]
* **Cultivation Patterns**
  150+ farm survey responses from Central Province collected via field studies.\[10]
* **Climate Data**
  Meteorological Department API providing hourly updates on temperature, humidity, and rainfall.\[7]
* **Pest & Disease Database**
  National Agricultural Information System (NAIS) records for pest and disease occurrences (2018–2025).\[10]

## Roadmap & Milestones

### Phase 1: Foundation (Q2–Q3 2025)

* [x] Core recommendation engine and crop lifecycle tracker
* [x] Basic PWA interface with user registration and dashboard
* [ ] Regional pilot launch in Kandy District

### Phase 2: Expansion (Q4 2025)

* [ ] IoT sensor integration for soil moisture and weather monitoring
* [ ] Multi-language support (Sinhala / Tamil)
* [ ] Mobile app development (iOS & Android)

### Phase 3: Ecosystem (2026)

* [ ] Blockchain-enabled supply chain tracking
* [ ] Satellite imagery analysis for large-scale yield forecasting
* [ ] Expansion to South Asia regional markets

## Contributing to Agricultural Innovation

We welcome agronomists, developers, and researchers to join us in transforming Sri Lanka's farming future. Please review our:

* [Contribution Guidelines](CONTRIBUTING.md)
* [Code of Conduct](CODE_OF_CONDUCT.md)

## License

This project operates under the MIT License – see [LICENSE](LICENSE) for details.

## Core Team

* **Himath** (Team Lead & System Architect)
* **Pankaja** (UI/UX Designer & Frontend Developer)
* **Haren** (Backend Developer & Database Engineer)
* **Sithija** (Full-Stack Developer & DevOps Engineer)

*Supported by Sri Lanka Agritech Innovation Fund 2025*
