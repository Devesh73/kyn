import time
import pandas as pd # type: ignore
import google.generativeai as genai # type: ignore
from dotenv import load_dotenv
import os


# Retrieve the API key from the environment variable
load_dotenv()
API_KEY = os.getenv("GOOGLE_API_KEY")

# Configure the Gemini SDK with the API key
genai.configure(api_key=API_KEY)

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
