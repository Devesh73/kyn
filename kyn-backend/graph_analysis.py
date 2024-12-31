import pandas as pd
import json
import networkx as nx
from networkx.algorithms.community import greedy_modularity_communities
import matplotlib.pyplot as plt
import os
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from collections import Counter
import ast

# Paths to data files
DATA_DIR = "kyn-backend/data"
USERS_FILE = os.path.join(DATA_DIR, "neo4j_users.json")
INTERACTIONS_FILE = os.path.join(DATA_DIR, "neo4j_interactions.json")
GROUPS_FILE = os.path.join(DATA_DIR, "neo4j_groups.json")


def load_data():
    """Load data from JSON files into Pandas DataFrames."""
    try:
        with open(USERS_FILE, "r") as f:
            users_data = json.load(f)
        with open(INTERACTIONS_FILE, "r") as f:
            interactions_data = json.load(f)
        with open(GROUPS_FILE, "r") as f:
            groups_data = json.load(f)

        users_df = pd.DataFrame(users_data)
        interactions_df = pd.DataFrame(interactions_data)
        groups_df = pd.DataFrame(groups_data)

        print("Data loaded successfully.")
        return users_df, interactions_df, groups_df
    except FileNotFoundError as e:
        print(f"Error: {e}")
        print("Make sure the JSON files are present in the correct directory.")
        raise
    except json.JSONDecodeError as e:
        print(f"Error: {e}")
        print("One or more JSON files are not properly formatted.")
        raise


def preprocess_interactions(interactions_df):
    """Ensure column names are correct and preprocess the interactions DataFrame."""
    expected_columns = [
        "user1",
        "user2",
        "interaction_type",
        "timestamp",
        "interaction_weight",
        "platform",
        "post_id",
    ]
    actual_columns = interactions_df.columns.tolist()

    if actual_columns != expected_columns:
        print(f"Renaming columns: {actual_columns} -> {expected_columns}")
        interactions_df.columns = expected_columns

    return interactions_df


def create_graph(users_df, interactions_df):
    """Create a NetworkX graph from users and interactions."""
    G = nx.Graph()

    # Add nodes
    for _, row in users_df.iterrows():
        G.add_node(
            row["id"],
            name=row.get("name", ""),
            location=row.get("location", ""),
            followers=row.get("followers", 0),
            following=row.get("following", 0),
            interests=row.get("interests", "[]"),  # Ensure interests are included
        )

    # Add edges
    for _, row in interactions_df.iterrows():
        try:
            G.add_edge(
                row["user1"],
                row["user2"],
                interaction_type=row["interaction_type"],
                weight=row["interaction_weight"],
                platform=row["platform"],
                post_id=row["post_id"],
                timestamp=row["timestamp"],
            )
        except KeyError as e:
            print(f"Missing column in interactions_df: {e}")
            raise

    return G


def analyze_graph(G):
    """Analyze the graph for basic properties."""
    print(f"Number of nodes: {G.number_of_nodes()}")
    print(f"Number of edges: {G.number_of_edges()}")
    print(f"Average degree: {sum(dict(G.degree()).values()) / G.number_of_nodes():.2f}")


def detect_communities(G):
    """Detect communities using a modularity-based algorithm."""
    print("Detecting communities...")
    communities = list(greedy_modularity_communities(G))
    community_map = {
        node: idx for idx, community in enumerate(communities) for node in community
    }
    nx.set_node_attributes(G, community_map, "community")
    print(f"Detected {len(communities)} communities.")
    return communities


def visualize_communities(G, communities):
    """Visualize the graph with community coloring."""
    print("Generating layout for visualization...")
    pos = nx.spring_layout(G, seed=42, weight="weight")

    plt.figure(figsize=(12, 8))
    cmap = plt.get_cmap("tab20")

    for idx, community in enumerate(communities):
        nx.draw_networkx_nodes(
            G,
            pos,
            nodelist=list(community),
            node_size=50,
            node_color=[cmap(idx / len(communities))],
            label=f"Community {idx + 1}",
        )

    nx.draw_networkx_edges(G, pos, alpha=0.3)
    plt.title("Community Visualization")
    plt.legend()
    plt.show()


def interest_segmentation(users_df):
    """Perform KMeans clustering on user interests."""
    print("Performing interest segmentation...")

    if "interests" not in users_df.columns:
        print("Error: No 'interests' column found in users_df.")
        return users_df

    try:
        # Ensure that 'interests' are properly converted into lists
        def parse_interests(interest_str):
            try:
                if isinstance(interest_str, str):
                    # Use ast.literal_eval to safely evaluate the list
                    interests = ast.literal_eval(interest_str)
                    if isinstance(interests, list):
                        # Sanitize interests by stripping unwanted characters
                        return [interest.strip() for interest in interests]
                return []
            except Exception as e:
                print(f"Error parsing interests: {e}")
                return []

        users_df["interests"] = users_df["interests"].apply(parse_interests)

        # Flatten the list of interests and extract unique interests
        unique_interests = sorted(
            set(
                interest
                for interests in users_df["interests"]
                for interest in interests
            )
        )

        # Create a binary matrix for interests
        interest_data = pd.DataFrame(
            [
                [
                    1 if interest in user_interests else 0
                    for interest in unique_interests
                ]
                for user_interests in users_df["interests"]
            ],
            columns=unique_interests,
        )

        # Standardize the data
        scaler = StandardScaler()
        interest_data_scaled = scaler.fit_transform(interest_data)

        # Perform clustering
        kmeans = KMeans(n_clusters=4, random_state=42)
        users_df["interest_cluster"] = kmeans.fit_predict(interest_data_scaled)
        print("Interest segmentation completed.")
    except Exception as e:
        print(f"Error during interest segmentation: {e}")

    return users_df


def advanced_community_analysis(G, communities):
    """Perform advanced analysis on community groups."""
    print("Analyzing communities for advanced insights...")

    # Store insights in a dictionary
    community_insights = {}

    for idx, community in enumerate(communities):
        subgraph = G.subgraph(community)

        # Calculate centrality metrics
        degree_centrality = nx.degree_centrality(subgraph)
        betweenness_centrality = nx.betweenness_centrality(subgraph, normalized=True)
        closeness_centrality = nx.closeness_centrality(subgraph)

        # Identify key influencers
        top_degree = max(degree_centrality, key=degree_centrality.get)
        top_betweenness = max(betweenness_centrality, key=betweenness_centrality.get)
        top_closeness = max(closeness_centrality, key=closeness_centrality.get)

        # Aggregate interests
        interests = [
            G.nodes[node].get("interests", [])
            for node in community
            if "interests" in G.nodes[node]
        ]
        flat_interests = [interest for sublist in interests for interest in sublist]

        interest_distribution = Counter(flat_interests)

        # Validate interest distribution
        valid_interest_distribution = {
            interest: count
            for interest, count in interest_distribution.items()
            if interest.isalpha()  # Ensure interest is a valid word
        }

        community_insights[f"Community {idx + 1}"] = {
            "Size": len(community),
            "Top influencer (degree)": top_degree,
            "Top influencer (betweenness)": top_betweenness,
            "Top influencer (closeness)": top_closeness,
            "Interest distribution": valid_interest_distribution,
        }

    # Save insights to a JSON file
    insights_file = os.path.join(DATA_DIR, "community_insights.json")
    with open(insights_file, "w") as f:
        json.dump(community_insights, f, indent=4)

    print(f"Insights saved to {insights_file}")


if __name__ == "__main__":
    print("Loading data...")
    users_df, interactions_df, groups_df = load_data()

    print("Preprocessing interactions...")
    interactions_df = preprocess_interactions(interactions_df)

    print("Creating graph...")
    G = create_graph(users_df, interactions_df)

    print("Analyzing graph...")
    analyze_graph(G)

    print("Detecting communities...")
    communities = detect_communities(G)

    print("Visualizing communities...")
    visualize_communities(G, communities)

    print("Performing interest segmentation...")
    users_df = interest_segmentation(users_df)

    print("Characterizing communities...")
    advanced_community_analysis(G, communities)
