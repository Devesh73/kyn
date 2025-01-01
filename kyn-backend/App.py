from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
import os
import networkx as nx
import json
import pandas as pd
from graph_analysis import (
    load_data,
    preprocess_interactions,
    create_graph,
    detect_communities,
    advanced_community_analysis,
    visualize_communities,
    interest_segmentation,
)
from chatbot import get_chatbot_response

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Global variables for caching data to avoid reloading repeatedly
users_df, interactions_df, groups_df = None, None, None
G = None
communities = None


@app.route("/")
def index():
    """Render the homepage (optional)."""
    return render_template("index.html")


@app.route("/load-data", methods=["POST"])
def initialize_data():
    """Load and preprocess data for analysis."""
    global users_df, interactions_df, groups_df, G, communities
    try:
        # Load data and preprocess
        users_df, interactions_df, groups_df = load_data()
        interactions_df = preprocess_interactions(interactions_df)
        G = create_graph(users_df, interactions_df)
        communities = detect_communities(G)
        advanced_community_analysis(G, communities)  # Save insights

        # Return success message
        return jsonify({"message": "Data loaded and analyzed successfully."})
    except FileNotFoundError as e:
        return jsonify({"error": f"File not found: {e.filename}. Check the path."}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/graph", methods=["GET"])
def get_graph():
    """Return graph data in JSON format."""
    global G
    try:
        if G is None:
            return jsonify({"error": "Graph not initialized. Load data first."}), 400
        graph_data = nx.node_link_data(G)
        return jsonify(graph_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/communities", methods=["GET"])
def get_communities():
    """Return detected communities."""
    global communities
    try:
        if communities is None:
            return jsonify({"error": "Communities not detected. Load data first."}), 400
        # Convert frozenset to list for JSON serialization
        communities_list = [list(community) for community in communities]
        return jsonify({"communities": communities_list})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/community-insights", methods=["GET"])
def get_community_insights():
    """Return community insights."""
    try:
        insights_file = os.path.join("data", "community_insights.json")
        if not os.path.exists(insights_file):
            return (
                jsonify(
                    {"error": "Community insights file not found. Load data first."}
                ),
                400,
            )
        with open(insights_file, "r") as f:
            community_insights = json.load(f)
        return jsonify(community_insights)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/chat", methods=["POST"])
def chat():
    """Chatbot endpoint for interacting with users."""
    data = request.get_json()
    user_input = data.get("message", "")
    if not user_input:
        return jsonify({"error": "Message is required."}), 400
    response = get_chatbot_response(user_input)
    return jsonify({"response": response})


if __name__ == "__main__":
    app.run(debug=True)
