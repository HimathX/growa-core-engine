import requests
import logging

logger = logging.getLogger(__name__)

GOOGLE_API_KEY = "AIzaSyC24Tl1deS5-EuauSolF_4BivH52Z6wBSs"
GEMINI_MODEL = "gemini-2.0-flash"

def generate_gemini_response(system_prompt: str, context: str, user_query: str) -> str:
    """
    Generate a response using Google Gemini API.
    """
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={GOOGLE_API_KEY}"
    
    try:
        payload = {
            "contents": [
                {"parts": [{"text": f"{system_prompt}\n\nContext:\n{context}\n\nUser: {user_query}"}]}
            ]
        }
        
        response = requests.post(url, json=payload)
        response.raise_for_status()
        
        data = response.json()
        return data["candidates"][0]["content"]["parts"][0]["text"]
    except requests.RequestException as e:
        logger.error(f"Gemini API request error: {str(e)}")
        return "Sorry, I couldn't process your question due to a technical issue with the API."
    except (KeyError, IndexError) as e:
        logger.error(f"Error parsing Gemini response: {str(e)}")
        return "Sorry, I received an unexpected response format from the AI service."
    except Exception as e:
        logger.error(f"Unexpected error in Gemini response generation: {str(e)}")
        return "Sorry, an unexpected error occurred while processing your question."