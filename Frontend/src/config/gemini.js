// Gemini API Configuration
// Replace 'YOUR_GEMINI_API_KEY_HERE' with your actual Google Gemini API key

export const GEMINI_CONFIG = {
    API_KEY: 'AIzaSyAnqAUF_gN6nTbogqaqlkNBoByvzXX7Wrw', // Replace with your actual API key
    API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    MODEL: 'gemini-pro',
    GENERATION_CONFIG: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
    }
};

// Instructions for getting your API key:
// 1. Go to https://makersuite.google.com/app/apikey
// 2. Sign in with your Google account
// 3. Click "Create API Key"
// 4. Copy the generated API key
// 5. Replace 'YOUR_GEMINI_API_KEY_HERE' above with your actual key
// 6. Save this file

// Example:
// API_KEY: 'AIzaSyD1234567890abcdefghijklmnopqrstuvwxyz',
