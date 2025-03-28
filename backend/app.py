import json
import networkx as nx  # type: ignore
from networkx.readwrite import json_graph  # type: ignore
from community_detection import detect_communities, analyze_centrality
from graph_operations import calculate_graph_metrics
import os
from flask import Flask, jsonify, request
from flask import send_file
import matplotlib.pyplot as plt
from chatbot import get_chatbot_response
from flask_cors import CORS
import random


# Get the absolute path to the data files
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
USERS_FILE = os.path.join(BASE_DIR, "data/users.json")
INTERACTIONS_FILE = os.path.join(BASE_DIR, "data/interactions.json")
app = Flask(__name__)
CORS(app)


def generate_random_coordinates():
    """
    Generate random coordinates for latitude and longitude.
    """
    latitude = random.uniform(-90, 90)
    longitude = random.uniform(-180, 180)
    return {"latitude": latitude, "longitude": longitude}


@app.route("/")
def index():
    return "Social Media Analytics Backend is running!"


def load_data_from_file(file_path):
    """
    Load data from a JSON file.
    """
    try:
        print(f"Loading data from file: {file_path}")  # Debugging print statement
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")
        with open(file_path, "r") as file:
            data = json.load(file)
        return data
    except FileNotFoundError as e:
        raise Exception(f"File not found: {file_path}")
    except json.JSONDecodeError as e:
        raise Exception(f"Error decoding JSON: {e}")


def build_graph_from_files(users_file=USERS_FILE, interactions_file=INTERACTIONS_FILE):
    """
    Build a NetworkX graph using data from JSON files.
    """
    try:
        # Load users data from file
        users_data = load_data_from_file(users_file)
        users = users_data.get("users", [])
        print("Loaded users snippets:")
        print("Users:", users[:2])  # Print first 2 users

        # Load interactions data from file
        interactions_data = load_data_from_file(interactions_file)
        interactions = interactions_data.get("interactions", [])
        print("Loaded interactions snippets:")
        print("Interactions:", interactions[:2])  # Print first 2 interactions

        graph = nx.Graph()

        # Add nodes (users)
        for user in users:
            user_id = user.get("user_id")
            if not user_id:
                continue  # Skip if no user_id is present

            graph.add_node(user_id, **user)

        # Add edges (interactions)
        for interaction in interactions:
            source_user = interaction.get("source_user")
            target_user = interaction.get("target_user")
            if source_user and target_user:
                graph.add_edge(source_user, target_user, **interaction)

        # Print the number of nodes and edges
        print(
            f"Graph has {graph.number_of_nodes()} nodes and {graph.number_of_edges()} edges."
        )

        return graph
    except Exception as e:
        raise Exception(f"Error building graph: {e}")


@app.route("/api/load-data", methods=["GET"])
def load_data():
    """
    Fetch social media data from JSON files, but only return a success message.
    """
    try:
        # Load the users data but don't return the interactions
        load_data_from_file(USERS_FILE).get("users", [])
        load_data_from_file(INTERACTIONS_FILE).get("interactions", [])

        return jsonify({"message": "Data loaded successfully."})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/graph-metrics", methods=["GET"])
def get_graph_metrics():
    """
    Endpoint to fetch graph metrics.
    """
    try:
        graph = build_graph_from_files()
        metrics = calculate_graph_metrics(graph)
        return jsonify(metrics)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/community-insights", methods=["GET"])
def get_community_insights():
    """
    Endpoint to fetch detected communities.
    """
    try:
        graph = build_graph_from_files()
        communities = detect_communities(graph)

        insights = {
            "number_of_communities": len(communities),
            "modularity": nx.algorithms.community.modularity(graph, communities),
            "communities": [list(community) for community in communities],
            "centrality": analyze_centrality(graph),
        }

        return jsonify(insights)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/users", methods=["GET"])
def get_users():
    """
    Endpoint to fetch the list of all users.
    """
    try:
        users = load_data_from_file(USERS_FILE).get("users", [])
        return jsonify({"users": users})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/user-community/<user_id>", methods=["GET"])
def get_user_community(user_id):
    """
    Endpoint to fetch the community of a specific user.
    """
    try:
        graph = build_graph_from_files()
        communities = detect_communities(graph)

        for idx, community in enumerate(communities):
            if user_id in community:
                return jsonify(
                    {
                        "user_id": user_id,
                        "community_id": idx + 1,
                        "members": list(community),
                    }
                )

        return jsonify({"error": f"User {user_id} not found in any community."}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/user-search/<user_id>", methods=["GET"])
def search_user(user_id):
    try:
        graph = build_graph_from_files()
        if user_id in graph.nodes:
            return jsonify(graph.nodes[user_id])
        return jsonify({"error": f"User {user_id} not found."}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/user-interactions/<user_id>", methods=["GET"])
def user_interactions(user_id):
    try:
        graph = build_graph_from_files()
        if user_id not in graph.nodes:
            return jsonify({"error": f"User {user_id} not found."}), 404

        edges = [
            {"target": target, "attributes": graph.edges[user_id, target]}
            for target in graph.neighbors(user_id)
        ]
        return jsonify({"user_id": user_id, "interactions": edges})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/user-influence/<user_id>", methods=["GET"])
def user_influence(user_id):
    """
    Analyze a user's influence in the network.
    """
    try:
        graph = build_graph_from_files()
        if user_id not in graph:
            return jsonify({"error": f"User {user_id} not found."}), 404

        centrality_metrics = {
            "degree_centrality": nx.degree_centrality(graph),
            "betweenness_centrality": nx.betweenness_centrality(graph),
            "closeness_centrality": nx.closeness_centrality(graph),
        }

        influence = {
            metric: centrality.get(user_id, 0)
            for metric, centrality in centrality_metrics.items()
        }
        return jsonify({"user_id": user_id, "influence": influence})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/influence-analysis", methods=["GET"])
def influence_analysis():
    try:
        graph = build_graph_from_files()
        degree_centrality = nx.degree_centrality(graph)
        betweenness_centrality = nx.betweenness_centrality(graph)
        closeness_centrality = nx.closeness_centrality(graph)
        influence_scores = {}
        for user_id in graph.nodes:
            avg_score = (
                degree_centrality.get(user_id, 0)
                + betweenness_centrality.get(user_id, 0)
                + closeness_centrality.get(user_id, 0)
            ) / 3

            influence_scores[user_id] = avg_score

        sorted_influencers = sorted(
            influence_scores.items(), key=lambda x: x[1], reverse=True
        )

        return jsonify({"top_influencers": sorted_influencers})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/misinformation-communities", methods=["GET"])
def misinformation_communities():
    """
    Identify communities spreading misinformation, the users responsible,
    and the regions affected.
    """
    try:
        # Sample data about misinformation - in a real system this would be derived
        # from analysis of actual content and network structure

        data = {
            "misinformation_data": [
                {
                    "news": "Financial Scam Warnings",
                    "location": "Mumbai",
                    "summary": "Recent social media trends indicate a rise in misinformation regarding financial scams targeting urban professionals in Mumbai. The misinformation includes false alerts about specific banks facing imminent collapse, fabricated investment schemes claiming government backing, and misleading tax policy information affecting salaried employees. It originated from anonymous Telegram channels posing as financial insiders, spread initially through WhatsApp groups of corporate employees, and was amplified by financial influencers with over 100K followers. The Reserve Bank of India and SEBI issued clarifications to debunk these claims. This has led to multiple fraud cases as people sought alternative investments, temporary banking service disruptions due to panic withdrawals, and heightened financial anxiety among middle-class professionals. Recommended actions include coordinating with financial institutions for clear communication, launching a targeted social media campaign with accurate guidance, and publishing scam case studies.",
                    "potential_flagged_sources": "User ID: u742",
                    "source_communities": "community 3",
                },
                {
                    "news": "Delhi Election Misinformation",
                    "location": "Delhi",
                    "summary": "Multiple social media platforms have been flooded with false claims about electoral irregularities in Delhi's recent assembly elections. The misinformation suggests tampered Electronic Voting Machines (EVMs), voter suppression of certain demographics, and manipulated vote counts during transmission. It began with a video of a malfunctioning EVM from a routine test, shared by @DelhiTruthSeeker with misleading context, and reached 2.5 million views after amplification by three political figures. The Election Commission clarified the video was from a training session, not the election. This has sparked public demonstrations in three constituencies, reduced voter trust per post-election surveys, and drawn international media scrutiny. Recommended actions include immediate fact-checking distribution, targeted communication to affected areas, and engagement with community leaders to rebuild trust.",
                    "potential_flagged_sources": "User ID: u319",
                    "source_communities": "community 7",
                },
                {
                    "news": "COVID-19 Vaccine Misinformation Analysis",
                    "location": "Delhi",
                    "summary": "A coordinated campaign in Delhi is spreading dangerous misinformation about severe side effects of the latest COVID-19 booster vaccines, claiming they cause a new virus variant, severe neurological issues, and that the government is hiding thousands of deaths. It originated from an edited video of out-of-context medical conference clips, first appearing on alternative video platforms before hitting mainstream social media, amplified by health and wellness accounts with a combined 7.3M followers. Fact-checking organizations and the Health Ministry have issued rebuttals. This has caused a 35% drop in vaccine bookings in Delhi NCR, reports of people seeking harmful 'detox' treatments, and increased hostility toward healthcare workers. Recommended actions include a public health messaging campaign, engagement with medical professionals, and requesting content removal from platforms.",
                    "potential_flagged_sources": "User ID: u568",
                    "source_communities": "community 9",
                },
                {
                    "news": "Maha Kumbh Mela Misinformation",
                    "location": "Lucknow",
                    "summary": "In January 2025, posts on X and mainstream media spread false claims about the Maha Kumbh Mela in Prayagraj, near Lucknow, causing confusion and safety concerns. The misinformation included fabricated reports of bridge collapses, severe water contamination, stampedes with casualties, and exaggerated crowd size estimates fueling panic. It stemmed from edited images from past events shared as current by unverified news accounts, amplified by domestic and international media. The Uttar Pradesh government debunked it, taking action against 101 social media accounts. This led to reduced pilgrim attendance, widespread panic among attendees and families, resource diversion to counter false narratives, and economic losses for local businesses. Recommended actions include establishing a real-time information verification center, deploying official photographers, coordinating with media for responsible reporting, and issuing regular updates.",
                    "potential_flagged_sources": "User ID: u214",
                    "source_communities": "community 5",
                },
            ]
        }

        return jsonify(data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/trending-interests", methods=["GET"])
def trending_topics():
    """
    Identify trending topics across the network.
    """
    try:
        users_data = load_data_from_file(USERS_FILE).get("users", [])
        topic_counts = {}

        for user in users_data:
            for topic in user.get("interests", []):
                topic_counts[topic] = topic_counts.get(topic, 0) + 1

        trending = sorted(topic_counts.items(), key=lambda x: x[1], reverse=True)
        return jsonify(
            {"trending_interests": [{"interest": k, "count": v} for k, v in trending]}
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/interaction-trends", methods=["GET"])
def interaction_trends():
    """
    Analyze interaction trends in the network.
    """
    try:
        interactions_data = load_data_from_file(INTERACTIONS_FILE).get(
            "interactions", []
        )
        interaction_counts = {}

        for interaction in interactions_data:
            timestamp = interaction.get("timestamp", "unknown")
            interaction_counts[timestamp] = interaction_counts.get(timestamp, 0) + 1

        trends = [
            {"date": date, "interaction_count": count}
            for date, count in sorted(interaction_counts.items())
        ]
        return jsonify({"interaction_trends": trends})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/active-communities", methods=["GET"])
def active_communities():
    """
    Identify the most active communities based on interaction frequency.
    """
    try:
        graph = build_graph_from_files()
        communities = detect_communities(graph)

        activity_scores = []
        for idx, community in enumerate(communities):
            subgraph = graph.subgraph(community)
            activity = sum(
                data.get("weight", 1) for _, _, data in subgraph.edges(data=True)
            )
            activity_scores.append(
                {
                    "community_id": idx + 1,
                    "activity_score": activity,
                    "size": len(community),
                }
            )

        active_communities = sorted(
            activity_scores, key=lambda x: x["activity_score"], reverse=True
        )
        return jsonify({"active_communities": active_communities})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/recommended-connections/<user_id>", methods=["GET"])
def recommended_connections(user_id):
    try:
        graph = build_graph_from_files()
        if user_id not in graph.nodes:
            return jsonify({"error": f"User {user_id} not found."}), 404

        recommendations = nx.jaccard_coefficient(
            graph, [(user_id, n) for n in graph.nodes if n != user_id]
        )
        sorted_recommendations = sorted(
            recommendations, key=lambda x: x[2], reverse=True
        )
        return jsonify(
            {"user_id": user_id, "recommended_connections": sorted_recommendations}
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/recommended-communities/<user_id>", methods=["GET"])
def recommended_communities(user_id):
    """
    Recommend communities for a user to join.
    """
    try:
        graph = build_graph_from_files()
        if user_id not in graph:
            return jsonify({"error": f"User {user_id} not found."}), 404

        communities = detect_communities(graph)
        user_interests = set(graph.nodes[user_id].get("interests", []))
        recommendations = []

        for idx, community in enumerate(communities):
            community_interests = set()
            for member in community:
                community_interests.update(graph.nodes[member].get("interests", []))

            shared_interests = len(user_interests & community_interests)
            if shared_interests > 0:
                recommendations.append(
                    {"community_id": idx + 1, "shared_interests": shared_interests}
                )

        recommendations = sorted(
            recommendations, key=lambda x: x["shared_interests"], reverse=True
        )
        return jsonify({"user_id": user_id, "recommended_communities": recommendations})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/geographic-insights", methods=["GET"])
def geographic_insights():
    try:
        graph = build_graph_from_files()
        location_groups = {}
        for node, data in graph.nodes(data=True):
            location = data.get("location")
            if location:
                if location not in location_groups:
                    location_groups[location] = {
                        "users": [],
                        "coordinates": generate_random_coordinates(),
                    }
                location_groups[location]["users"].append(node)

        return jsonify(location_groups)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/full-graph", methods=["GET"])
def get_full_graph():
    """
    Endpoint to fetch the full graph as JSON.
    """
    try:
        graph = build_graph_from_files()
        graph_data = json_graph.node_link_data(graph)
        return jsonify(graph_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/visualize-graph", methods=["GET"])
def visualize_graph():
    """
    Generate and serve an image of the full graph.
    """
    try:
        graph = build_graph_from_files()
        output_path = os.path.join(BASE_DIR, "data/full_graph_visualization.png")

        plt.figure(figsize=(12, 12))
        pos = nx.spring_layout(graph, seed=42)
        nx.draw(
            graph,
            pos,
            with_labels=False,
            node_size=50,
            node_color="blue",
            edge_color="gray",
            alpha=0.7,
        )
        plt.title("Full Graph Visualization", fontsize=16)
        plt.savefig(output_path)
        plt.close()

        return send_file(output_path, mimetype="image/png")
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/community-graph", methods=["GET"])
def get_community_graph():
    """
    Return raw community data for visualization.
    """
    try:
        graph = build_graph_from_files()
        communities = detect_communities(graph)

        community_graphs = []
        for community in communities:
            subgraph = graph.subgraph(community)
            graph_data = json_graph.node_link_data(subgraph)
            community_graphs.append(graph_data)

        return jsonify({"communities": community_graphs})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/visualize-community", methods=["GET"])
def visualize_community():
    """
    Generate and serve an image of the communities as subgraphs.
    """
    try:
        graph = build_graph_from_files()
        communities = detect_communities(graph)

        output_path = os.path.join(BASE_DIR, "data/community_visualization.png")
        plt.figure(figsize=(12, 12))

        for idx, community in enumerate(communities):
            subgraph = graph.subgraph(community)
            pos = nx.spring_layout(subgraph, seed=42)
            nx.draw(
                subgraph,
                pos,
                with_labels=False,
                node_size=50,
                node_color=f"C{idx}",  # Assign a unique color per community
                edge_color="gray",
                alpha=0.7,
            )

        plt.title("Community Visualization", fontsize=16)
        plt.savefig(output_path)
        plt.close()

        return send_file(output_path, mimetype="image/png")
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/chat", methods=["POST"])
def chatbot_endpoint():
    try:
        """
        Flask endpoint for chatbot interaction.
        """
        data = request.get_json()
        user_input = data.get("message", "")
        if not user_input:
            return jsonify({"error": "Message is required."}), 400

        response = get_chatbot_response(user_input)
        return jsonify({"response": response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
