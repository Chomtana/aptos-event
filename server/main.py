from flask import Flask, request, send_from_directory, jsonify
from flask_cors import CORS
from openai import OpenAI
import json
import requests
import os
import uuid

# Initialize Flask app
app = Flask(__name__)
CORS(app)
client = OpenAI(api_key='')  # Replace with your actual OpenAI API key
host = 'https://ai-mint-metadata.chom.dev'

# Define the directory to save images
IMAGE_DIR = 'images'
os.makedirs(IMAGE_DIR, exist_ok=True)

def amplify_prompt(short_prompt):
    # Generate detailed prompt using ChatGPT
    chat_response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
          {
            "role": "user",
            "content": f"Generate a realistic style {short_prompt} product prompt for use in image generation",
          }
        ],
        max_tokens=100
    )
    detailed_prompt = chat_response.choices[0].message.content.strip()
    return detailed_prompt

@app.route('/generate-images', methods=['POST'])
def generate_images():
    collection_id = request.json.get('collection_id') if request.json.get('collection_id') else str(uuid.uuid4())
  
    # Get the short prompt from the request
    short_prompt = request.json.get('prompt')
    if not short_prompt:
        return jsonify({"error": "Prompt is required"}), 400

    # Amplify the prompt using ChatGPT
    detailed_prompt = amplify_prompt(short_prompt)
    
    print('Detailed Prompt:', detailed_prompt)
    
    responses = []

    # Generate images using OpenAI API
    for _ in range(4):
        response = client.images.generate(
            model="dall-e-3",
            prompt=detailed_prompt,
            size="1024x1024",
            quality="standard",
            n=1,
        )
        
        responses.append(response.data[0])

    image_urls = []
    for i, data in enumerate(responses):
        # Get the image URL from the response
        image_url = data.url

        # Download and save the image to disk
        image_path = os.path.join(IMAGE_DIR, f"{collection_id}-{i}.png")
        image_data = requests.get(image_url).content
        with open(image_path, 'wb') as f:
            f.write(image_data)
        
        # Generate NFT Metadata
        nft_metadata = {
            "name": short_prompt,
            "image": f"{host}/images/{collection_id}-{i}.png",
            "description": detailed_prompt
        }
        metadata_path = os.path.join(IMAGE_DIR, f"{collection_id}-{i}.json")
        with open(metadata_path, 'w') as f:
            json.dump(nft_metadata, f)
        
        image_urls.append(f"/images/{collection_id}-{i}.png")

    return jsonify({"image_urls": image_urls, "collection_id": collection_id}), 200

@app.route('/images/<filename>')
def serve_image(filename):
    return send_from_directory(IMAGE_DIR, filename)

if __name__ == '__main__':
    app.run(debug=True)