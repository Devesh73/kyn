import os
import json
import requests
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
API_KEY = os.getenv("GOOGLE_API_KEY")
BASE_API_URL = "http://127.0.0.1:5000/api"


# Configure Gemini SDK
genai.configure(api_key=API_KEY)
generation_config = {
    "temperature": 0.7,
    "top_p": 0.9,
    "max_output_tokens": 2000,
}
model = genai.GenerativeModel(
    model_name="gemini-1.5-flash", generation_config=generation_config
)
chat_session = model.start_chat(history=[])

# API endpoints mapping
API_ENDPOINTS = {
    "trending_interests": f"{BASE_API_URL}/trending-interests",
    "active_communities": f"{BASE_API_URL}/active-communities",
    "influence_analysis": f"{BASE_API_URL}/influence-analysis",
    "interaction_trends": f"{BASE_API_URL}/interaction-trends",
    "user_search": f"{BASE_API_URL}/user-search/{{user_id}}",
    "user_influence": f"{BASE_API_URL}/user-influence/{{user_id}}",
    "user_interaction": f"{BASE_API_URL}/user-interactions/{{user_id}}",
    "recommended_connections": f"{BASE_API_URL}/recommended-connections/{{user_id}}",
    "recommended_communities": f"{BASE_API_URL}/recommended-communities/{{user_id}}",
}


# Fetch data from APIs
def fetch_api_data(endpoint, params=None, limit=None):
    try:
        print(f"Fetching data from: {endpoint}")
        response = requests.get(endpoint, params=params)
        response.raise_for_status()
        data = response.json()

        # Limit results if applicable
        if limit and isinstance(data, dict):
            for key in data:
                if isinstance(data[key], list):
                    data[key] = data[key][:limit]
        print(f"Data fetched successfully: {json.dumps(data, indent=2)}")
        return data
    except requests.RequestException as e:
        print(f"Error fetching data from {endpoint}: {str(e)}")
        return {"error": f"Failed to fetch data from {endpoint}. Error: {str(e)}"}


# Preprocess data for Gemini
def format_data_for_gemini(api_name, data):
    try:
        if api_name == "trending_interests":
            return {"trending_interests": data.get("trending_interests", [])[:20]}

        if api_name == "active_communities":
            communities = data.get("active_communities", [])
            for community in communities:
                community["activity_score"] = round(
                    community["activity_score"] / 100, 2
                )
            return {"active_communities": communities[:20]}

        if api_name == "influence_analysis":
            influencers = data.get("top_influencers", [])
            for influencer in influencers:
                influencer[1] = round(influencer[1] * 100, 2)
            return {"top_influencers": influencers[:20]}

        if api_name == "interaction_trends":
            return {"interaction_trends": data.get("interaction_trends", [])[:20]}

        if api_name == "user_influence":
            influence = data.get("influence", {})
            avg_score = round(
                (
                    100 * influence.get("betweenness_centrality", 0)
                    + 100 * influence.get("closeness_centrality", 0)
                    + 100 * influence.get("degree_centrality", 0)
                )
                / 3,
                2,
            )
            return {"user_id": data.get("user_id"), "influence_score": avg_score}

        if api_name == "recommended_connections":
            recommendations = data.get("recommended_connections", [])
            formatted_connections = []
            for rec in recommendations:
                formatted_connections.append(
                    {
                        "source_user_id": rec[0],
                        "target_user_id": rec[1],
                        "connection_strength_percentage": round(rec[2] * 100, 2),
                    }
                )
            return {"recommended_connections": formatted_connections}

        if api_name == "recommended_communities":
            communities = data.get("recommended_communities", [])
            formatted_communities = []
            for community in communities:
                formatted_communities.append(
                    {
                        "community_id": community["community_id"],
                        "shared_interests_count": community["shared_interests"],
                    }
                )
            return {"recommended_communities": formatted_communities}

        return data
    except Exception as e:
        print(f"Error formatting data for Gemini: {str(e)}")
        return {"error": f"Formatting failed for {api_name}. Error: {str(e)}"}


# Extract User IDs using LLM
def extract_user_ids(user_input):
    user_id_prompt = f"""
    Extract the user ID(s) from the input query. The user ID is a unique identifier for a user in the social media platform.
    You can do this by looking for patterns like:
    - user id (e.g., "user 12")
    - User ID (e.g., "User 22")
    - u<digits> (e.g., "u32")
    - U<digits> (e.g., "U77"), etc.

    Output all found user IDs in the format "U<number>". One per line, with a comma between multiple IDs.
    If no user ID is found, return "None".

    User Query: "{user_input}"
    """
    response = chat_session.send_message(user_id_prompt)
    user_ids = [
        uid.strip() for uid in response.text.strip().split(",") if uid.startswith("U")
    ]
    print(f"Extracted User IDs: {user_ids}")
    return user_ids


# Classify user query and trigger APIs
def classify_and_trigger_apis(user_input):
    classification_prompt = f"""
    You are an API classifier. Based on the user query below, decide which APIs to call.
    Select all relevant APIs from the following list:
    - trending_interests
    - active_communities
    - influence_analysis
    - interaction_trends
    - user_search (requires user_id)
    - user_influence (requires user_id)
    - user_interaction (requires user_id)
    - recommended_connections (requires user_id)
    - recommended_communities (requires user_id)

    Output only the names of the relevant APIs, one per line.

    User Query: "{user_input}"
    """
    response = chat_session.send_message(classification_prompt)
    api_predictions = [api.strip() for api in response.text.strip().split("\n") if api]
    print(f"Predicted APIs: {api_predictions}")
    return api_predictions


# Handle irrelevant queries
def handle_irrelevant_queries(user_input):
    small_talk_prompt = f"""
    You are a concise assistant. Respond briefly to the user's query. Do not provide long explanations or insights.

    User Query: {user_input}
    """
    response = chat_session.send_message(small_talk_prompt)
    return response.text.strip()


# Process and respond to queries
def get_chatbot_response(user_input):
    try:
        api_triggers = classify_and_trigger_apis(user_input)
        user_ids = extract_user_ids(user_input)
        data_payload = {}

        # Handle user-specific APIs
        for trigger in api_triggers:
            if trigger in [
                "user_search",
                "user_influence",
                "user_interaction",
                "recommended_connections",
                "recommended_communities",
            ]:
                if user_ids:
                    for user_id in user_ids:
                        endpoint = API_ENDPOINTS[trigger].format(user_id=user_id)
                        api_data = fetch_api_data(endpoint, limit=20)
                        formatted_data = format_data_for_gemini(trigger, api_data)
                        data_payload[f"{trigger}_{user_id}"] = formatted_data
                else:
                    print(f"Skipping {trigger}: No user IDs found.")
            elif trigger in API_ENDPOINTS:
                endpoint = API_ENDPOINTS[trigger]
                api_data = fetch_api_data(endpoint, limit=20)
                formatted_data = format_data_for_gemini(trigger, api_data)
                data_payload[trigger] = formatted_data

        if not data_payload:
            return handle_irrelevant_queries(user_input)

        master_prompt = f"""
        You are an advanced data assistant for a social media platform manager. Based on the user's query and preprocessed data, provide the following:
        - Clear, user-friendly insights or summaries.
        - Key trends, patterns, or comparisons.
        - Summarize recommendations clearly.
            - For recommended connections, explain which users should connect, why, and the connection strength as a percentage.
            - For recommended communities, explain the communities that the user might join and the number of shared interests they have.
        - Use structured responses and avoid technical jargon.


        User Query: {user_input}
        Preprocessed Data: {json.dumps(data_payload, indent=2)}

        Focus on actionable insights and avoid technical jargon.
        """
        response = chat_session.send_message(master_prompt)
        return response.text.strip()

    except Exception as e:
        print(f"Error processing chatbot response: {str(e)}")
        return f"An error occurred: {str(e)}"
