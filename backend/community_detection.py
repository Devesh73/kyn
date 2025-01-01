import networkx as nx
import matplotlib.pyplot as plt
from networkx.algorithms.community import greedy_modularity_communities
from networkx.algorithms.community.quality import modularity
import os
import json

# Path to data and graph visualization
DATA_PATH = os.path.join("backend", "data", "social_media_data.json")
COMMUNITY_VISUALIZATION_PATH = os.path.join(
    "backend", "data", "community_visualization.png"
)


def load_graph(data_path):
    """
    Load JSON data and build a graph.
    """
    with open(data_path, "r") as f:
        data = json.load(f)

    G = nx.DiGraph()  # Directed graph
    for user in data["users"]:
        G.add_node(user["user_id"], **user)

    for interaction in data["interactions"]:
        G.add_edge(
            interaction["source_user"],
            interaction["target_user"],
            interaction_type=interaction["interaction_type"],
            weight=interaction["weight"],
        )

    return G


def detect_communities(G):
    """
    Detect communities using the Greedy Modularity algorithm.
    """
    undirected_graph = (
        G.to_undirected()
    )  # Convert to undirected for community detection
    communities = list(greedy_modularity_communities(undirected_graph))
    modularity_score = modularity(undirected_graph, communities)

    return communities, modularity_score


def analyze_centrality(G):
    """
    Analyze centrality measures for nodes in the graph.
    """
    degree_centrality = nx.degree_centrality(G)
    betweenness_centrality = nx.betweenness_centrality(G)
    closeness_centrality = nx.closeness_centrality(G)

    # Combine centrality scores for analysis
    centrality_scores = {}
    for node in G.nodes():
        centrality_scores[node] = {
            "degree": degree_centrality.get(node, 0),
            "betweenness": betweenness_centrality.get(node, 0),
            "closeness": closeness_centrality.get(node, 0),
        }

    return centrality_scores


def visualize_communities(G, communities, output_path):
    """
    Visualize the graph with communities highlighted.
    """
    plt.figure(figsize=(15, 15))
    pos = nx.spring_layout(G, seed=42)

    # Assign a unique color to each community
    colors = plt.cm.tab20.colors  # Use a predefined colormap
    for i, community in enumerate(communities):
        nx.draw_networkx_nodes(
            G,
            pos,
            nodelist=list(community),
            node_size=50,
            node_color=[colors[i % len(colors)]],
            label=f"Community {i+1}",
        )

    # Draw edges
    nx.draw_networkx_edges(G, pos, alpha=0.3)

    plt.title("Community Detection Visualization", fontsize=18)
    plt.legend()
    plt.savefig(output_path)
    print(f"Community visualization saved to {output_path}")


if __name__ == "__main__":
    print("Loading graph...")
    graph = load_graph(DATA_PATH)

    print("Detecting communities...")
    communities, modularity_score = detect_communities(graph)
    print(f"Number of communities detected: {len(communities)}")
    print(f"Modularity score: {modularity_score:.4f}")

    print("Analyzing centrality...")
    centrality_scores = analyze_centrality(graph)
    print("Centrality analysis completed.")

    print("Visualizing communities...")
    visualize_communities(graph, communities, COMMUNITY_VISUALIZATION_PATH)
