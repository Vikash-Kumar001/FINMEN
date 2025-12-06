# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from datetime import datetime
import os

from Gemini import chat_with_gemini, generate_session_id

load_dotenv()
app = Flask(__name__)
CORS(app)

@app.route("/", methods=["POST"])
def home():
    return "Wise Student Chatbot is running!"

@app.route("/chat", methods=["POST"])
def handle_chat():
    data = request.get_json()
    user_msg = data.get("message")
    session_id = data.get("session_id") or generate_session_id()

    if not user_msg:
        return jsonify({"error": "Empty message"}), 400

    try:
        response = chat_with_gemini(session_id, user_msg)
        # No MongoDB insertion
        return jsonify({"response": response, "session_id": session_id})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))  # Changed to 5001 to avoid conflict
    print(f"Flask server starting on port {port}...")
    print("Wise Student AIML Chatbot Service Ready! 🤖✨")
    app.run(debug=False, host='0.0.0.0', port=port)
