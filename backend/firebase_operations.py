import os
import json
import firebase_admin
from firebase_admin import credentials, firestore, storage
from config import FIREBASE_CONFIG, DATA_PATH

# Initialize Firebase Admin
cred = credentials.Certificate(FIREBASE_CONFIG)
firebase_admin.initialize_app(cred)

# Firestore Database
db = firestore.client()

def upload_to_firebase_storage(file_path, destination_blob_name):
    """
    Upload a file to Firebase Storage.
    """
    try:
        blob = bucket.blob(destination_blob_name)
        blob.upload_from_filename(file_path)
        print(f"File {file_path} uploaded to {destination_blob_name}.")
        return blob.public_url
    except Exception as e:
        print(f"Error uploading file: {e}")
        return None


def add_document_to_firestore(collection_name, document_data):
    """
    Add a document to a Firestore collection.
    """
    try:
        doc_ref = db.collection(collection_name).add(document_data)
        print(f"Document added to {collection_name}: {doc_ref}")
        return doc_ref
    except Exception as e:
        print(f"Error adding document: {e}")
        return None


def push_data_to_firestore():
    """
    Push data from social_media_data.json to Firestore.
    """
    try:
        # Load data from JSON file
        with open(DATA_PATH, "r") as file:
            data = json.load(file)

        # Loop through each user in the "users" array and add to Firestore
        users = data.get("users", [])
        collection_name = "users"  # Name of the Firestore collection

        for user in users:
            doc_ref = add_document_to_firestore(collection_name, user)
            print(f"Added user: {user['user_id']} with document reference: {doc_ref}")
    except FileNotFoundError:
        print(f"File not found: {DATA_PATH}")
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")
    except Exception as e:
        print(f"Unexpected error: {e}")


if __name__ == "__main__":
    push_data_to_firestore()
