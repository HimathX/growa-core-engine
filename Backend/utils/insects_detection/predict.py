import numpy as np
import os
from PIL import Image
from io import BytesIO
import joblib
from keras.models import Model
from keras.layers import GlobalAveragePooling2D
from keras.applications.vgg16 import VGG16, preprocess_input
from keras.preprocessing.image import img_to_array
from pathlib import Path

# Configuration
CURRENT_DIR = Path(os.path.dirname(os.path.abspath(__file__)))
FEATURE_DIR = CURRENT_DIR / "features"
MODEL_TYPE = "fused"  # Options: "block1", "block2", "block3", "block4", "block5", "fused"
NORMALIZE = True  # Use the same normalization as during evaluation

# Global variables for loaded resources
class_names = None
feature_model = None
svm_model = None

def load_resources():
    """Load all required resources for prediction"""
    global class_names, feature_model, svm_model
    
    try:
        if class_names is None:
            class_names = np.load(os.path.join(FEATURE_DIR, "class_names.npy"), allow_pickle=True)
        
        if feature_model is None:
            # Build feature extraction model
            base_model = VGG16(weights='imagenet', include_top=False)
            c1 = GlobalAveragePooling2D()(base_model.get_layer("block1_pool").output)
            c2 = GlobalAveragePooling2D()(base_model.get_layer("block2_pool").output)
            c3 = GlobalAveragePooling2D()(base_model.get_layer("block3_pool").output)
            c4 = GlobalAveragePooling2D()(base_model.get_layer("block4_pool").output)
            c5 = GlobalAveragePooling2D()(base_model.get_layer("block5_pool").output)
            feature_model = Model(inputs=base_model.input, outputs=[c1, c2, c3, c4, c5])
        
        if svm_model is None:
            svm_model = joblib.load(os.path.join(FEATURE_DIR, f"svm_{MODEL_TYPE}.joblib"))
            
        print("Insect detection model loaded successfully!")
        return class_names, feature_model, svm_model
        
    except Exception as e:
        print(f"Error loading insect detection resources: {str(e)}")
        raise

def predict_image(image_bytes):
    """Predict the class of an insect image from bytes"""
    # Load resources if not already loaded
    global class_names, feature_model, svm_model
    if class_names is None or feature_model is None or svm_model is None:
        class_names, feature_model, svm_model = load_resources()
    
    try:
        # Convert bytes to PIL Image
        img = Image.open(BytesIO(image_bytes))
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Resize and convert to array
        img = img.resize((224, 224))
        img_array = img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = preprocess_input(img_array)
        
        # Extract features
        features = feature_model.predict(img_array)
        
        # Prepare feature vector based on selected model type
        if MODEL_TYPE == "block1":
            feature_vector = features[0]
        elif MODEL_TYPE == "block2":
            feature_vector = features[1]
        elif MODEL_TYPE == "block3":
            feature_vector = features[2]
        elif MODEL_TYPE == "block4":
            feature_vector = features[3]
        elif MODEL_TYPE == "block5":
            feature_vector = features[4]
        else:  # Fused features
            feature_vector = np.concatenate(features, axis=1)
        
        # Apply normalization if used during training
        if NORMALIZE:
            feature_vector = np.sqrt(np.abs(feature_vector)) * np.sign(feature_vector)
        
        # Make prediction
        prediction = svm_model.predict(feature_vector)
        probabilities = svm_model.decision_function(feature_vector)
        
        # Get top predictions
        top5_indices = np.argsort(probabilities[0])[::-1][:5]
        top5_classes = [class_names[i] for i in top5_indices]
        top5_confidences = [probabilities[0][i] for i in top5_indices]
        
        return {
            "predicted_class": class_names[prediction[0]],
            "confidence": float(np.max(probabilities)),
            "top5_predictions": [
                {"class": cls, "confidence": float(conf)} 
                for cls, conf in zip(top5_classes, top5_confidences)
            ]
        }
    
    except Exception as e:
        print(f"Prediction error: {str(e)}")
        return {
            "error": f"Prediction failed: {str(e)}",
            "predicted_class": None,
            "confidence": 0.0,
            "top5_predictions": []
        }