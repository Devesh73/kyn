import os
import json
import networkx as nx
import matplotlib.pyplot as plt


def load_users_data(users_path="backend/data/users.json"):
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


def load_interactions_data(interactions_path="backend/data/interactions.json"):
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
    G = nx.DiGraph()  # Directed graph to represent interactions

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


def calculate_graph_metrics(G):
    """
    Calculate and return key graph metrics.
    """
    metrics = {
        "number_of_nodes": G.number_of_nodes(),
        "number_of_edges": G.number_of_edges(),
        "density": nx.density(G),
    }

    # Metrics for undirected graphs
    if not G.is_directed():
        metrics.update(
            {
                "is_connected": nx.is_connected(G),
                "number_of_connected_components": nx.number_connected_components(G),
            }
        )
        if nx.is_connected(G):
            largest_component = max(nx.connected_components(G), key=len)
            metrics["largest_component_size"] = len(largest_component)
            metrics["diameter"] = nx.diameter(G.subgraph(largest_component))
        else:
            metrics["largest_component_size"] = None
            metrics["diameter"] = None

    # Metrics for directed graphs
    else:
        metrics.update(
            {
                "is_weakly_connected": nx.is_weakly_connected(G),
                "number_of_weakly_connected_components": nx.number_weakly_connected_components(
                    G
                ),
                "is_strongly_connected": nx.is_strongly_connected(G),
            }
        )
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
    try:
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
    except Exception as e:
        raise Exception(f"Error visualizing graph: {e}")


if __name__ == "__main__":
    try:
        print("Loading data...")
        users = load_users_data()
        interactions = load_interactions_data()

        print("Building graph...")
        graph = build_graph(users, interactions)

        print("Calculating graph metrics...")
        metrics = calculate_graph_metrics(graph)
        for key, value in metrics.items():
            print(f"{key}: {value}")

        print("Visualizing graph...")
        visualize_graph(graph)

    except Exception as e:
        print(f"Error: {e}")
