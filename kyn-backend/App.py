from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
import networkx as nx
import json
import time
import pandas as pd
from graph_analysis import (
    load_data,
    create_graph,
    detect_communities,
    advanced_community_analysis,
    visualize_communities,
    interest_segmentation,
)
import google.generativeai as genai
from dotenv import load_dotenv
import os


app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

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


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/community-groups", methods=["GET"])
def get_community_groups():
    try:
        users_df, interactions_df, _ = load_data()
        G = create_graph(users_df, interactions_df)
        communities = detect_communities(G)

        # Convert frozenset to list
        communities_list = [list(community) for community in communities]

        analysis_results = advanced_community_analysis(G, communities)
        return jsonify({"communities": communities_list, "analysis": analysis_results})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/graph", methods=["GET"])
def get_graph():
    try:
        users_df, interactions_df, _ = load_data()
        G = create_graph(users_df, interactions_df)
        graph_data = nx.node_link_data(G)
        return jsonify(graph_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/community-insights", methods=["GET"])
def get_community_insights():
    try:
        with open("kyn-backend/data/community_insights.json", "r") as f:
            community_insights = json.load(f)
        return jsonify(community_insights)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_input = data.get("message", "")
    if not user_input:
        return jsonify({"error": "Message is required."}), 400
    response = get_chatbot_response(user_input)
    return jsonify({"response": response})


if __name__ == "__main__":
    app.run(debug=True)
