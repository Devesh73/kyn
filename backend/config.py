import os

# Firebase configuration
FIREBASE_CONFIG = {
    "type": "service_account",
    "project_id": "your-firebase-project-id",
    "private_key_id": "your-private-key-id",
    "private_key": os.getenv("FIREBASE_PRIVATE_KEY", "your-private-key"),
    "client_email": "firebase-adminsdk@your-project-id.iam.gserviceaccount.com",
    "client_id": "your-client-id",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk%40your-project-id.iam.gserviceaccount.com",
}

# Other configurations
DATA_PATH = os.path.join("backend", "data", "social_media_data.json")
