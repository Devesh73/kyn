from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import time
import google.generativeai as genai # type: ignore

app = Flask(__name__)
CORS(app) 

# Set the API key as an environment variable (replace with your real API key)
os.environ["GOOGLE_API_KEY"] = "AIzaSyDs7yHR0uVMSn7NFZaJhZuvBmQuITmDZPE"

# Retrieve the API key from the environment variable
api_key = os.getenv("GOOGLE_API_KEY")

# Configure the Gemini SDK with the API key
genai.configure(api_key=api_key)

# Create the generative model
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
)

# Start a new chat session
chat_session = model.start_chat(history=[])

# Function to interact with Gemini API and handle responses
def get_chatbot_response(user_input):
    retries = 3
    delay = 5  # seconds

    for attempt in range(retries):
        try:
            response = chat_session.send_message(user_input)
            return response.text
        except Exception as e:
            if "quota" in str(e).lower():
                time.sleep(delay)
            else:
                return "Sorry, there was an error processing your request."

    return "Sorry, the service is currently unavailable. Please try again later."

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_input = data.get('message', '')

    if not user_input:
        return jsonify({"error": "Message is required."}), 400

    response = get_chatbot_response(user_input)
    return jsonify({"response": response})

if __name__ == '__main__':
    app.run(debug=True)