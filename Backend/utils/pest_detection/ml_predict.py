import torch
from PIL import Image
import torch.nn as nn
import torch.nn.functional as F
from torchvision.transforms import ToTensor
import torchvision.transforms as transforms
import pickle
import io
import json
import os
from typing import Tuple, Dict, Any
from pathlib import Path

# Get the current directory for relative file paths
CURRENT_DIR = Path(os.path.dirname(os.path.abspath(__file__)))

# Model class definition
class Network(nn.Module):
    def __init__(self):
        super(Network,self).__init__()
        self.conv1= nn.Conv2d(in_channels=3,out_channels=6,kernel_size=5)
        self.conv2= nn.Conv2d(in_channels=6,out_channels=12,kernel_size=5)
        self.conv3= nn.Conv2d(in_channels=12,out_channels=24,kernel_size=5)
        self.conv4= nn.Conv2d(in_channels=24,out_channels=48,kernel_size=5)
        
        self.fc1 = nn.Linear(in_features=48*12*12,out_features=240)
        self.fc2 = nn.Linear(in_features=240,out_features=120)
        self.out = nn.Linear(in_features=120,out_features=17)
        
    def forward(self,t):
        t=self.conv1(t)
        t=F.relu(t)
        t=F.max_pool2d(t,kernel_size = 2, stride = 2)
        
        t=self.conv2(t)
        t=F.relu(t)
        t=F.max_pool2d(t,kernel_size = 2, stride = 2)

        t=self.conv3(t)
        t=F.relu(t)
        t=F.max_pool2d(t,kernel_size = 2, stride = 2)

        t=self.conv4(t)
        t=F.relu(t)
        t=F.max_pool2d(t,kernel_size = 2, stride = 2)
        
        t=t.reshape(-1,48*12*12)
        t=self.fc1(t)
        t=F.relu(t)
        
        t=self.fc2(t)
        t=F.relu(t)
        
        t=self.out(t)
        
        return t

# Load model and data (singleton pattern)
_model = None
_labels = None
_remedies = None

def _load_model():
    global _model, _labels, _remedies
    if _model is None:
        try:
            # Load model
            _model = Network()
            model_path = CURRENT_DIR / "model.pth"
            _model.load_state_dict(torch.load(str(model_path), map_location=torch.device('cpu')))
            _model.eval()
            
            # Load labels
            with open(str(CURRENT_DIR / "labels.json"), 'rb') as lb:
                _labels = pickle.load(lb)
                
            # Load remedies
            with open(str(CURRENT_DIR / "data.json"), 'r') as f:
                _remedies = json.load(f)
                
            print("Pest detection model loaded successfully.")
        except Exception as e:
            print(f"Error loading pest detection model: {str(e)}")
            raise

def get_remedy(plant_disease: str) -> str:
    """Get remedy for the given plant disease"""
    if _remedies is None:
        _load_model()
        
    for key in _remedies: # type: ignore
        if key == plant_disease:
            return _remedies[key] # type: ignore
    return "Not Found!"

@torch.no_grad()
def predict_plant(img_data: bytes) -> Dict[str, Any]:
    """Predict plant disease from image data"""
    if _model is None:
        _load_model()
        
    try:
        # Convert bytes to image
        image = Image.open(io.BytesIO(img_data))
        
        # Preprocess image
        resize = transforms.Compose([transforms.Resize((256,256))])
        image_tensor = ToTensor()(image)
        
        # Get prediction
        y_result = _model(resize(image_tensor).unsqueeze(0)) # type: ignore
        result_idx = y_result.argmax(dim=1).item()
        
        # Get confidence scores
        confidence_scores = torch.nn.functional.softmax(y_result, dim=1)[0]
        confidence = confidence_scores[result_idx].item() * 100
        
        # Get plant disease name
        plant_disease = None
        for key, value in _labels.items(): # type: ignore
            if value == result_idx:
                plant_disease = key
                break
        
        if plant_disease is None:
            return {
                "status": "error", 
                "plant_disease": "Unknown",
                "confidence": 0.0,
                "remedy": "Could not identify plant disease"
            }
        
        # Get remedy
        if "healthy" not in plant_disease.lower():
            remedy = get_remedy(plant_disease)
        else:
            remedy = "Plant is Healthy"
            
        return {
            "status": "success",
            "plant_disease": plant_disease,
            "confidence": round(confidence, 2),
            "remedy": remedy
        }
        
    except Exception as e:
        print(f"Prediction failed: {str(e)}")
        return {
            "status": "error",
            "plant_disease": "Error",
            "confidence": 0.0,
            "remedy": f"Prediction failed: {str(e)}"
        }

# Initialize model at module import time
try:
    _load_model()
except Exception as e:
    print(f"Warning: Failed to load model at startup: {str(e)}")