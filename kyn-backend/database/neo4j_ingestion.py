from neo4j import GraphDatabase
import json
from dotenv import load_dotenv
import os

load_dotenv()
URI = os.getenv("NEO4J_URI")
USERNAME = os.getenv("NEO4J_USERNAME")
PASSWORD = os.getenv("NEO4J_PASSWORD")


class Neo4jIngestion:
    def __init__(self, uri, user, password):
        """Initialize Neo4j driver."""
        self.driver = GraphDatabase.driver(uri, auth=(user, password))

    def close(self):
        """Close the Neo4j connection."""
        self.driver.close()

    def ingest_users(self, users):
        """Ingest user nodes into Neo4j."""
        with self.driver.session() as session:
            for user in users:
                session.run(
                    """
                    CREATE (u:User {
                        id: $id,
                        name: $name,
                        email: $email,
                        bio: $bio,
                        profile_picture: $profile_picture,
                        location: $location,
                        interests: $interests,
                        account_created: $account_created,
                        followers: $followers,
                        following: $following
                    })
                    """,
                    id=user["id"],
                    name=user["name"],
                    email=user["email"],
                    bio=user["bio"],
                    profile_picture=user["profile_picture"],
                    location=user["location"],
                    interests=user["interests"],
                    account_created=user["account_created"],
                    followers=user["followers"],
                    following=user["following"],
                )

    def ingest_interactions(self, interactions):
        """Ingest interaction relationships into Neo4j."""
        with self.driver.session() as session:
            for interaction in interactions:
                session.run(
                    """
                    MATCH (u1:User {id: $user1}), (u2:User {id: $user2})
                    CREATE (u1)-[:INTERACTS_WITH {
                        type: $interaction_type,
                        platform: $platform,
                        timestamp: $timestamp,
                        interaction_weight: $interaction_weight,
                        post_id: $post_id
                    }]->(u2)
                    """,
                    user1=interaction["user1"],
                    user2=interaction["user2"],
                    interaction_type=interaction["interaction_type"],
                    platform=interaction["platform"],
                    timestamp=interaction["timestamp"],
                    interaction_weight=interaction["interaction_weight"],
                    post_id=interaction["post_id"],
                )

    def ingest_groups(self, groups):
        """Ingest group nodes and their memberships into Neo4j."""
        with self.driver.session() as session:
            for group in groups:
                session.run(
                    """
                    CREATE (g:Group {
                        group_id: $group_id,
                        name: $group_name,
                        shared_interest: $shared_interest
                    })
                    """,
                    group_id=group["group_id"],
                    group_name=group["group_name"],
                    shared_interest=group["shared_interest"],
                )
                for member_id in group["members"]:
                    session.run(
                        """
                        MATCH (u:User {id: $user_id}), (g:Group {group_id: $group_id})
                        CREATE (u)-[:MEMBER_OF]->(g)
                        """,
                        user_id=member_id,
                        group_id=group["group_id"],
                    )


if __name__ == "__main__":
    # Load data from JSON files
    data_dir = os.path.join(os.path.dirname(__file__), "../Data")
    with open(os.path.join(data_dir, "fake_users.json"), "r") as f:
        users = json.load(f)
    with open(os.path.join(data_dir, "fake_interactions.json"), "r") as f:
        interactions = json.load(f)
    with open(os.path.join(data_dir, "fake_groups.json"), "r") as f:
        groups = json.load(f)

    # Initialize Neo4j ingestion class
    neo4j_ingestion = Neo4jIngestion(URI, USERNAME, PASSWORD)

    # Ingest data into Neo4j
    print("Ingesting users...")
    neo4j_ingestion.ingest_users(users)
    print("Ingesting interactions...")
    neo4j_ingestion.ingest_interactions(interactions)
    print("Ingesting groups...")
    neo4j_ingestion.ingest_groups(groups)

    # Close the Neo4j connection
    neo4j_ingestion.close()
    print("Data ingestion complete!")
