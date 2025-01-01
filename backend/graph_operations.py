import json
import networkx as nx
import matplotlib.pyplot as plt
import os

# Path to data
DATA_PATH = os.path.join("backend", "data", "social_media_data.json")


def load_data(file_path):
    """
    Load JSON data from the given file path.
    """
    with open(file_path, "r") as f:
        return json.load(f)


def build_graph(data):
    """
    Build a NetworkX graph from the provided data.
    """
    G = nx.DiGraph()  # Directed graph for interactions

    # Add users as nodes
    for user in data["users"]:
        G.add_node(user["user_id"], **user)

    # Add interactions as edges
    for interaction in data["interactions"]:
        G.add_edge(
            interaction["source_user"],
            interaction["target_user"],
            interaction_type=interaction["interaction_type"],
            weight=interaction["weight"],
            shared_interests=interaction["shared_interests"],
            geographic_proximity=interaction["geographic_proximity"],
        )

    return G


def calculate_graph_metrics(G):
    """
    Calculate and return key graph metrics.
    """
    metrics = {
        "number_of_nodes": G.number_of_nodes(),
        "number_of_edges": G.number_of_edges(),
        "density": nx.density(G),
        "is_weakly_connected": nx.is_weakly_connected(G),
        "number_of_weakly_connected_components": nx.number_weakly_connected_components(
            G
        ),
        "is_strongly_connected": nx.is_strongly_connected(G),
    }

    if metrics["is_weakly_connected"]:
        largest_component = max(nx.weakly_connected_components(G), key=len)
        metrics["largest_component_size"] = len(largest_component)
    else:
        metrics["largest_component_size"] = None

    return metrics


def visualize_graph(G, output_path="backend/data/graph_visualization.png"):
    """
    Visualize the graph and save it as an image.
    """
    plt.figure(figsize=(12, 12))
    pos = nx.spring_layout(G, seed=42)  # Layout for visualization
    nx.draw(
        G,
        pos,
        with_labels=False,
        node_size=20,
        node_color="blue",
        edge_color="gray",
        alpha=0.7,
    )
    plt.title("Social Media Interaction Graph", fontsize=16)
    plt.savefig(output_path)
    print(f"Graph visualization saved to {output_path}")


if __name__ == "__main__":
    print("Loading data...")
    data = load_data(DATA_PATH)

    print("Building graph...")
    graph = build_graph(data)

    print("Calculating graph metrics...")
    metrics = calculate_graph_metrics(graph)
    for key, value in metrics.items():
        print(f"{key}: {value}")

    print("Visualizing graph...")
    visualize_graph(graph)
