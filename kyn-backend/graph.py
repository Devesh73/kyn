from neo4j import GraphDatabase
import json
from dotenv import load_dotenv
import os

load_dotenv()
URI = os.getenv("NEO4J_URI")
AUTH = (os.getenv("NEO4J_USERNAME"), os.getenv("NEO4J_PASSWORD"))

with open("mock_dataset.json", "r") as file:
    data = json.load(file)

users = data["users"]
interactions = data["interactions"]


class Neo4jLoader:
    def __init__(self, uri, auth):
        self.driver = GraphDatabase.driver(uri, auth=auth)

    def close(self):
        self.driver.close()

    def clear_database(self):
        """Delete all nodes and relationships from the database"""
        with self.driver.session() as session:
            session.run("MATCH (n) DETACH DELETE n")

    def load_users(self, users):
        """Create User nodes with properties"""
        with self.driver.session() as session:
            for user in users:
                session.run(
                    """
                    MERGE (u:User {id: $id})
                    SET u.name = $name, u.interests = $interests
                    """,
                    id=user["id"],
                    name=user["name"],
                    interests=user["interests"],
                )

    def load_interactions(self, interactions):
        """Create relationships between users"""
        with self.driver.session() as session:
            for interaction in interactions:
                # Dynamically construct the Cypher query with the relationship type
                query = f"""
                    MATCH (u1:User {{id: $source}}), (u2:User {{id: $target}})
                    MERGE (u1)-[:{interaction["type"]}]->(u2)
                """
                session.run(
                    query, source=interaction["source"], target=interaction["target"]
                )


# Instantiate the loader
loader = Neo4jLoader(URI, AUTH)

try:
    print("Clearing the database...")
    loader.clear_database()
    print("Database cleared successfully!")

    print("Loading users into Neo4j...")
    loader.load_users(users)
    print("Users loaded successfully!")

    print("Loading interactions into Neo4j...")
    loader.load_interactions(interactions)
    print("Interactions loaded successfully!")

finally:
    loader.close()
    print("Connection to Neo4j closed.")
