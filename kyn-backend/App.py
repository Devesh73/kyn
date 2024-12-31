from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
import networkx as nx
import json
import pandas as pd
from graph_analysis import (
    load_data,
    create_graph,
    detect_communities,
    advanced_community_analysis,
    visualize_communities,
    interest_segmentation,
)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes


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


# @app.route("/query", methods=["POST"])
# def query():
#     try:
#         data = request.json
#         query = data.get('query')
#         # Process the query using Gemini and return the response
#         response = process_query_with_gemini(query)
#         return jsonify({"response": response})
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# def process_query_with_gemini(query):
#     # Implement the logic to process the query using Gemini
#     # This is a placeholder function
#     return "Processed query: " + query

if __name__ == "__main__":
    app.run(debug=True)
