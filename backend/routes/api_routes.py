from flask import Blueprint, jsonify, send_file
import os
import json
import networkx as nx
from networkx.readwrite import json_graph

# Paths
DATA_PATH = os.path.join("backend", "data", "social_media_data.json")
GRAPH_METRICS_PATH = os.path.join("backend", "data", "graph_metrics.json")
COMMUNITY_INSIGHTS_PATH = os.path.join("backend", "data", "community_insights.json")
GRAPH_VISUALIZATION_PATH = os.path.join("backend", "data", "graph_visualization.png")
COMMUNITY_VISUALIZATION_PATH = os.path.join(
    "backend", "data", "community_visualization.png"
)

# Blueprint for API routes
api_routes = Blueprint("api_routes", __name__)


@api_routes.route("/api/graph-metrics", methods=["GET"])
def get_graph_metrics():
    """
    Endpoint to fetch graph metrics.
    """
    try:
        with open(GRAPH_METRICS_PATH, "r") as f:
            metrics = json.load(f)
        return jsonify(metrics)
    except FileNotFoundError:
        return jsonify({"error": "Graph metrics not found."}), 404


@api_routes.route("/api/community-insights", methods=["GET"])
def get_community_insights():
    """
    Endpoint to fetch community-level insights.
    """
    try:
        with open(COMMUNITY_INSIGHTS_PATH, "r") as f:
            insights = json.load(f)
        return jsonify(insights)
    except FileNotFoundError:
        return jsonify({"error": "Community insights not found."}), 404


@api_routes.route("/api/graph-visualization", methods=["GET"])
def get_graph_visualization():
    """
    Endpoint to fetch graph visualization.
    """
    if os.path.exists(GRAPH_VISUALIZATION_PATH):
        return send_file(GRAPH_VISUALIZATION_PATH, mimetype="image/png")
    return jsonify({"error": "Graph visualization not found."}), 404


@api_routes.route("/api/community-visualization", methods=["GET"])
def get_community_visualization():
    """
    Endpoint to fetch community visualization.
    """
    if os.path.exists(COMMUNITY_VISUALIZATION_PATH):
        return send_file(COMMUNITY_VISUALIZATION_PATH, mimetype="image/png")
    return jsonify({"error": "Community visualization not found."}), 404


@api_routes.route("/api/full-graph", methods=["GET"])
def get_full_graph():
    """
    Endpoint to fetch the full graph in JSON format.
    """
    try:
        with open(DATA_PATH, "r") as f:
            data = json.load(f)
        G = nx.Graph()
        for user in data["users"]:
            G.add_node(user["user_id"], **user)
        for interaction in data["interactions"]:
            G.add_edge(
                interaction["source_user"],
                interaction["target_user"],
                weight=interaction["weight"],
            )
        graph_data = json_graph.node_link_data(G)
        return jsonify(graph_data)
    except FileNotFoundError:
        return jsonify({"error": "Social media data not found."}), 404
