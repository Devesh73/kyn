from neo4j import GraphDatabase
import json
import os
from dotenv import load_dotenv

load_dotenv()
URI = os.getenv("NEO4J_URI")
USERNAME = os.getenv("NEO4J_USERNAME")
PASSWORD = os.getenv("NEO4J_PASSWORD")


class Neo4jQuery:
    def __init__(self, uri, user, password):
        """Initialize Neo4j driver."""
        self.driver = GraphDatabase.driver(uri, auth=(user, password))

    def close(self):
        """Close the Neo4j connection."""
        self.driver.close()

    def query_users(self):
        """Query all user nodes."""
        with self.driver.session() as session:
            result = session.run("MATCH (u:User) RETURN u")
            users = [record["u"] for record in result]  # Extract user nodes
        return users

    def query_interactions(self):
        """Query all interaction relationships."""
        with self.driver.session() as session:
            result = session.run(
                """
                MATCH (u1:User)-[r:INTERACTS_WITH]->(u2:User)
                RETURN u1.id AS user1, u2.id AS user2, 
                       r.type AS interaction_type, 
                       r.timestamp AS timestamp,
                       r.interaction_weight AS interaction_weight, 
                       r.platform AS platform, 
                       r.post_id AS post_id
                """
            )
            interactions = [record for record in result]
        return interactions

    def query_groups(self):
        """Query all groups and memberships."""
        with self.driver.session() as session:
            result = session.run(
                """
                MATCH (u:User)-[:MEMBER_OF]->(g:Group)
                RETURN g.group_id AS group_id, g.shared_interest AS shared_interest,
                       g.name AS group_name, u.id AS user_id
                """
            )
            memberships = [record for record in result]
        return memberships

    def export_to_json(self, data, filename):
        """Save data to a JSON file."""
        output_dir = os.path.join(os.path.dirname(__file__), "../data")
        os.makedirs(output_dir, exist_ok=True)
        filepath = os.path.join(output_dir, filename)
        with open(filepath, "w") as f:
            json.dump(data, f, indent=4)
        print(f"Data exported to {filepath}")


if __name__ == "__main__":
    # Initialize Neo4j query class
    neo4j_query = Neo4jQuery(URI, USERNAME, PASSWORD)

    output_dir = "../data/"
    print(f"Saving data to {output_dir}...")

    # Query users
    print("Querying users...")
    users = neo4j_query.query_users()
    users_data = [
        {
            "id": user.id,
            "name": user.get("name"),
            "location": user.get("location"),
            "followers": user.get("followers"),
            "following": user.get("following"),
            "interests": user.get("interests"),
        }
        for user in users
    ]
    neo4j_query.export_to_json(users_data, "neo4j_users.json")

    # Query interactions
    print("Querying interactions...")
    interactions = neo4j_query.query_interactions()
    interactions_data = [
        {
            "user1": record["user1"],
            "user2": record["user2"],
            "interaction_type": record["interaction_type"],
            "timestamp": record["timestamp"],
            "interaction_weight": record["interaction_weight"],
            "platform": record["platform"],
            "post_id": record["post_id"],
        }
        for record in interactions
    ]
    neo4j_query.export_to_json(interactions_data, "neo4j_interactions.json")

    # Query groups
    print("Querying group memberships...")
    memberships = neo4j_query.query_groups()
    memberships_data = [
        {
            "group_id": record["group_id"],
            "shared_interest": record["shared_interest"],
            "group_name": record["group_name"],
            "user_id": record["user_id"],
        }
        for record in memberships
    ]
    neo4j_query.export_to_json(memberships_data, "neo4j_groups.json")

    # Close the connection
    neo4j_query.close()
    print("Querying and exporting completed!")
