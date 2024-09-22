from flask import Flask, request, jsonify
from flask_cors import CORS
import trial  # Import your trial.py functions here

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
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
