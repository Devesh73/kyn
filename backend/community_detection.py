import os
import json
import networkx as nx
from networkx.algorithms.community import greedy_modularity_communities
import matplotlib.pyplot as plt

# Paths to data files
USERS_FILE = "backend/data/users.json"
INTERACTIONS_FILE = "backend/data/interactions.json"
COMMUNITY_VISUALIZATION_PATH = "backend/data/community_visualization.png"


def load_users_data(users_path=USERS_FILE):
    """
    Load the users data from the JSON file.

    :param users_path: Path to the users data file.
    :return: List of users.
    """
    if not os.path.exists(users_path):
        raise FileNotFoundError(f"Data file not found at {users_path}")

    with open(users_path, "r") as f:
        data = json.load(f)

    # Print snippets of the loaded data for verification
    print("Loaded users snippets:")
    print("Users:", data.get("users", [])[:2])  # Print first 2 users

    return data["users"]


def load_interactions_data(interactions_path=INTERACTIONS_FILE):
    """
    Load the interactions data from the JSON file.

    :param interactions_path: Path to the interactions data file.
    :return: List of interactions.
    """
    if not os.path.exists(interactions_path):
        raise FileNotFoundError(f"Data file not found at {interactions_path}")

    with open(interactions_path, "r") as f:
        data = json.load(f)

    # Print snippets of the loaded data for verification
    print("Loaded interactions snippets:")
    print(
        "Interactions:", data.get("interactions", [])[:2]
    )  # Print first 2 interactions

    return data["interactions"]


def build_graph(users, interactions):
    """
    Build a NetworkX graph from the social media data.

    :param users: List of users.
    :param interactions: List of interactions.
    :return: NetworkX graph.
    """
    G = nx.Graph()  # Undirected graph to represent interactions

    # Add nodes (users)
    for user in users:
        G.add_node(
            user["user_id"],
            name=user["name"],
            age=user["age"],
            location=user["location"],
            interests=user["interests"],
            follower_count=user["follower_count"],
            following_count=user["following_count"],
            activity_level=user["activity_level"],
        )

    # Add edges (interactions)
    for interaction in interactions:
        G.add_edge(
            interaction["source_user"],
            interaction["target_user"],
            interaction_id=interaction["interaction_id"],
            interaction_type=interaction["interaction_type"],
            timestamp=interaction["timestamp"],
            weight=interaction["weight"],
        )

    return G


def detect_communities(graph):
    """
    Detect communities in the graph using a modularity-based algorithm.

    :param graph: NetworkX graph.
    :return: List of communities.
    """
    communities = list(greedy_modularity_communities(graph))
    return communities


def analyze_centrality(graph):
    """
    Analyze centrality measures in the graph.

    :param graph: NetworkX graph.
    :return: Dictionary of centrality scores.
    """
    centrality_scores = {
        "degree_centrality": nx.degree_centrality(graph),
        "betweenness_centrality": nx.betweenness_centrality(graph),
        "closeness_centrality": nx.closeness_centrality(graph),
    }
    return centrality_scores


def visualize_communities(graph, communities, output_path):
    """
    Visualize the graph with community coloring.

    :param graph: NetworkX graph.
    :param communities: List of communities.
    :param output_path: Path to save the visualization.
    """
    pos = nx.spring_layout(graph, seed=42)
    plt.figure(figsize=(12, 8))
    cmap = plt.get_cmap("tab20")

    for idx, community in enumerate(communities):
        nx.draw_networkx_nodes(
            graph,
            pos,
            nodelist=list(community),
            node_size=50,
            node_color=[cmap(idx / len(communities))],
            label=f"Community {idx + 1}",
        )

    nx.draw_networkx_edges(graph, pos, alpha=0.3)
    plt.title("Community Visualization")
    plt.legend()
    plt.savefig(output_path)
    plt.show()


if __name__ == "__main__":
    # Load data
    users = load_users_data()
    interactions = load_interactions_data()

    # Build graph
    graph = build_graph(users, interactions)

    # Detect communities
    communities = detect_communities(graph)
    print(f"Number of communities detected: {len(communities)}")

    # Calculate modularity score
    modularity_score = nx.algorithms.community.quality.modularity(graph, communities)
    print(f"Modularity score: {modularity_score:.4f}")

    # Analyze centrality
    print("Analyzing centrality...")
    centrality_scores = analyze_centrality(graph)
    print("Centrality analysis completed.")

    # Visualize communities
    print("Visualizing communities...")
    visualize_communities(graph, communities, COMMUNITY_VISUALIZATION_PATH)
