from flask import Flask, request, jsonify
from flask_cors import CORS
import trial  # Import your trial.py functions here
import numpy as np

app = Flask(__name__)
CORS(app)  # Add this to handle CORS

@app.route('/upload', methods=['POST'])
def upload_resume():
    if 'resume' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['resume']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    result = trial.process_resume(file)
    
    # Convert any numpy float32 values in the result to regular Python float
    def convert_float32(obj):
        if isinstance(obj, np.float32):
            return float(obj)
        elif isinstance(obj, dict):
            return {k: convert_float32(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [convert_float32(item) for item in obj]
        return obj

    # Ensure the result is serializable
    result = convert_float32(result)

    return jsonify(result)
