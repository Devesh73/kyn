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
    if api_name == "trending_interests":
        return {"trending_interests": data.get("trending_interests", [])[:20]}

    if api_name == "active_communities":
        communities = data.get("active_communities", [])
        for community in communities:
            community["activity_score"] = round(community["activity_score"] / 100, 2)
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

    if api_name in ["recommended_connections", "recommended_communities"]:
        recommendations = data.get(api_name.replace("recommended_", ""), [])[:20]
        if api_name == "recommended_connections":
            for rec in recommendations:
                rec[2] = round(rec[2] * 100, 2)
        return {api_name: recommendations}

    return data


# Extract User IDs using LLM
def extract_user_ids(user_input):
    user_id_prompt = f"""
    Extract the user ID from the input query. The user ID is a unique identifier for a user in the social media platform.
    You can do this by looking for words in the user input such as 
    user id (for example: user 12), 
    User ID (for example: User 22), 
    u<digits> (for example: u32), 
    U<digits> (for example: U77), etc.
    There may be multiple User IDs in the query, extract each one separately.

    Once you found the User IDs, they must be strictly represented in the following FORMAT only:
    "U<number>". 
    
    Ensure the result is formatted correctly and output only that and nothing else.
    User Query: "{user_input}"

    If no user ID is found, return "None". 
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
    You are an API classifier. Given the user query below, decide which are all the APIs to call.
    If the query asks for specific data, output only all the relevant API or APIs that may need to be called from this list of APIs:
    - trending_interests
    - active_communities
    - influence_analysis
    - interaction_trends
    - user_search (requires user_id)
    - user_influence (requires user_id)
    - user_interaction (requires user_id)
    - recommended_connections (requires user_id)
    - recommended-communities (requires user_id)

    Make sure to output only the names of the selected APIs and strictly nothing else.

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
    api_triggers = classify_and_trigger_apis(user_input)
    user_ids = extract_user_ids(user_input)
    data_payload = {}

    if "user_search" in api_triggers and user_ids:
        for user_id in user_ids:
            search_endpoint = API_ENDPOINTS["user_search"].format(user_id=user_id)
            search_result = fetch_api_data(search_endpoint)
            if "error" not in search_result:
                data_payload[f"user_search_{user_id}"] = search_result

    for trigger in api_triggers:
        if "requires user_id" in trigger:
            api_name = trigger.split()[0]
            for user_id in user_ids:
                if f"user_search_{user_id}" not in data_payload:
                    continue  # Skip if user is not validated via user_search
                endpoint = API_ENDPOINTS[api_name].format(user_id=user_id)
                api_data = fetch_api_data(endpoint, limit=20)
                formatted_data = format_data_for_gemini(api_name, api_data)
                data_payload[f"{api_name}_{user_id}"] = formatted_data
        else:
            api_name = trigger.strip()
            endpoint = API_ENDPOINTS.get(api_name)
            if endpoint:
                api_data = fetch_api_data(endpoint, limit=20)
                formatted_data = format_data_for_gemini(api_name, api_data)
                data_payload[api_name] = formatted_data

    if not data_payload:
        return handle_irrelevant_queries(user_input)

    master_prompt = f"""
    You are an advanced behavioral analyst and data assistant for a community manager or platform owner of a social media platform. Given the user's query and relevant preprocessed data, perform the following:

    - Provide clear, user-friendly insights or summaries.
    - Present key trends, patterns, or comparisons in a structured and easy-to-understand manner.
    - Refer to all scores as percentages with a "%" symbol 
    - If the query asks for a list or brief insights, provide concise and organized points.
    - For detailed insights, present organized information with relevant explanations and recommendations.

    User Query: {user_input}
    Preprocessed Data: {json.dumps(data_payload, indent=2)}

    Always focus on delivering actionable insights in a clear and understandable way. Avoid technical jargon or backend details—make the response as useful and intuitive as possible for a community manager or platform owner.
    """
    response = chat_session.send_message(master_prompt)
    return response.text.strip()
