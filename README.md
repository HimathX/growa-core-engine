
## Core Features

### Agricultural Decision Support
- **Field Optimization Matrix**  
  Spatial analysis combining GPS boundaries with historical yield data through QGIS integration[7][11]
- **Resource Navigator**  
  Geospatial directory of 1,200+ verified agricultural suppliers across 9 provinces[11]

### Farm Management Tools
- **Growth Phase Tracker**  
  Interactive timeline mapping planting (D0) to harvest (D90+) with stage-specific alerts
- **Input Calculator**  
  Fertilizer/water requirements based on crop type and plot size (0.25-5 acre support)[11]

### Market Integration
- **Price Prediction Engine**  
  LSTM neural network forecasting 30-day market trends with ±8% accuracy[5][11]
- **Direct Buyer Network**  
  Verified connections to 45+ wholesale markets and export agencies[11]

## Technical Implementation

### Architecture Overview
![System Architecture](docs/architecture.png)  
*Three-tier microservices architecture with agricultural data pipeline*

### Development Stack
| Component          | Technology               |
|--------------------|--------------------------|
| Frontend           | React PWA + LeafletJS    |
| Backend            | Django REST + PostGIS    |
| Machine Learning   | TensorFlow Lite + OpenCV |
| Infrastructure     | AWS EC2 + RDS            |


## Agricultural Data Sources
- **Soil Health Metrics**  
  Department of Agriculture field reports (2015-2025 dataset)[11]
- **Cultivation Patterns**  
  150+ farm survey responses from Central Province[11]
- **Climate Data**  
  Meteorological Department API (hourly updates)[11]

## Roadmap & Milestones

### Phase 1: Foundation (Q3 2025)
- [x] Core recommendation engine
- [x] Basic PWA interface
- [ ] Regional pilot (Kandy District)

### Phase 2: Expansion (Q4 2025)
- [ ] IoT sensor integration
- [ ] Multi-language support (Sinhala/Tamil)
- [ ] Mobile app development

### Phase 3: Ecosystem (2026)
- [ ] Blockchain supply chain
- [ ] Satellite imagery analysis
- [ ] Regional adaptation for South Asia

## Contributing to Agricultural Innovation
We welcome agronomists, developers, and researchers to improve Sri Lanka's farming future. Please review our:
- [Contribution Guidelines](CONTRIBUTING.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)

## License
This project operates under MIT License - see [LICENSE](LICENSE) for details.

## Core Team
- **Himath** (Team Lead) - System Architecture
- **Pankaja** (Design) - UX/UI Implementation
- **Haren** (Dev) - Backend Services
- **Sithija** (Dev) - ML Pipelines

*Supported by Sri Lanka Agritech Innovation Fund 2025*
