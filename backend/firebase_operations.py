import firebase_admin
from firebase_admin import credentials, firestore, storage

from config import FIREBASE_CONFIG

# Initialize Firebase Admin
cred = credentials.Certificate(FIREBASE_CONFIG)
firebase_admin.initialize_app(cred)

# Firestore Database
db = firestore.client()

# Firebase Storage
bucket = storage.bucket()


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
