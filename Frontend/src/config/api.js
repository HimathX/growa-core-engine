// API Configuration
export const API_CONFIG = {
    BASE_URL: 'http://127.0.0.1:8081',
    ENDPOINTS: {
        PEST_DETECTION: '/pest/predict',
        INSECT_DETECTION: '/insects/predict',
        PEST_STATUS: '/pest/status',
        INSECT_STATUS: '/insects/status'
    },
    TIMEOUTS: {
        UPLOAD: 30000, // 30 seconds
        ANALYSIS: 60000 // 60 seconds for AI analysis
    }
};

// Environment-based configuration
export const getApiBaseUrl = () => {
    if (process.env.NODE_ENV === 'production') {
        // In production, you might want to use a different URL
        return process.env.REACT_APP_API_URL || 'https://your-production-api.com';
    }
    return API_CONFIG.BASE_URL;
};

export default API_CONFIG;
