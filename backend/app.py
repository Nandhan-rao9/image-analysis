from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from datetime import datetime
import json
from openai import OpenAI
from dotenv import load_dotenv
import base64
from PIL import Image
import io
import time

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": "http://localhost:5173",
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

# USDA API configuration
USDA_API_KEY = os.getenv('USDA_API_KEY')
USDA_BASE_URL = 'https://api.nal.usda.gov/fdc/v1'

user_nutritional_data = {'food_items': []}

class ImageAnalyzer:
    def __init__(self, api_key):
        self.client = OpenAI(api_key=api_key)

    def encode_image(self, image_file):
        """Encode image from file upload to base64 string."""
        image_data = image_file.read()
        return base64.b64encode(image_data).decode('utf-8')

    def analyze_image_ML(self, image_file, prompt="What food items are in this image? Please list them separately."):
        """Analyze an image using OpenAI's Vision API."""
        try:
            base64_image = self.encode_image(image_file)
            response = self.client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": prompt},
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/jpeg;base64,{base64_image}"
                                }
                            }
                        ]
                    }
                ],
                max_tokens=300
            )
            return response.choices[0].message.content
        except Exception as e:
            raise Exception(f"Error analyzing image: {str(e)}")

def get_food_info_from_usda(food_name):
    """Fetch food information from USDA API"""
    try:
        search_url = f"{USDA_BASE_URL}/foods/search"
        params = {
            'api_key': USDA_API_KEY,
            'query': food_name,
            'dataType': ["Survey (FNDDS)"],
            'pageSize': 1
        }
        response = requests.get(search_url, params=params)
        response.raise_for_status()
        
        data = response.json()
        if data['foods']:
            food = data['foods'][0]
            nutrients = food.get('foodNutrients', [])
            
            nutrition_info = {
                'calories': next((n['value'] for n in nutrients if n['nutrientName'] == 'Energy'), 0),
                'protein': next((n['value'] for n in nutrients if n['nutrientName'] == 'Protein'), 0),
                'carbs': next((n['value'] for n in nutrients if n['nutrientName'] == 'Carbohydrate, by difference'), 0),
                'fat': next((n['value'] for n in nutrients if n['nutrientName'] == 'Total lipid (fat)'), 0),
                'fiber': next((n['value'] for n in nutrients if n['nutrientName'] == 'Fiber, total dietary'), 0),
                'vitamins': {
                    'a': next((n['value'] for n in nutrients if 'Vitamin A' in n['nutrientName']), 0),
                    'c': next((n['value'] for n in nutrients if 'Vitamin C' in n['nutrientName']), 0),
                    'd': next((n['value'] for n in nutrients if 'Vitamin D' in n['nutrientName']), 0),
                    'e': next((n['value'] for n in nutrients if 'Vitamin E' in n['nutrientName']), 0)
                },
                'minerals': {
                    'iron': next((n['value'] for n in nutrients if 'Iron' in n['nutrientName']), 0),
                    'calcium': next((n['value'] for n in nutrients if 'Calcium' in n['nutrientName']), 0),
                    'potassium': next((n['value'] for n in nutrients if 'Potassium' in n['nutrientName']), 0)
                }
            }
            
            return nutrition_info
        return None
    except requests.exceptions.RequestException as e:
        print(f"Error fetching USDA data: {e}")
        return None

@app.route('/analyze-image', methods=['POST'])
def analyze_image():
    """Endpoint for image analysis"""
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    try:
        # Initialize the image analyzer
        analyzer = ImageAnalyzer(os.getenv('OPENAI_API_KEY'))
        
        # Analyze the image
        image_file = request.files['image']
        food_items = analyzer.analyze_image_ML(image_file)
        
        # Parse the food items (assuming they're returned as a comma-separated list)
        foods = [item.strip() for item in food_items.split('\n') if item.strip()]
        
        # Get nutrition info for each identified food
        results = []
        for food in foods:
            print(food, "name")
            nutrition_info = get_food_info_from_usda(food)
            if nutrition_info:
                food_data = {
                    'name': food,
                    'confidence': 0.95,  # Placeholder confidence score
                    'nutrition': nutrition_info
                }
                results.append(food_data)
                
                # Store nutrition data for recommendations
                user_nutritional_data['food_items'].append(food_data)
        print(user_nutritional_data,"user_nut_data in analyze image")
        return jsonify(results)
    except Exception as e:
        return jsonify({'error': str(e)}), 500



    except Exception as e:
        # Log the error for debugging
        print("Error in recommendations:", str(e))
        return jsonify({'error': 'Failed to get recommendations due to an error.'}), 500

    
def print_variable_every_3_seconds(variable):
    while True:
        print(variable)  # Print the variable
        time.sleep(3) 

if __name__ == '__main__':
    app.run(debug=True,port = 8000)