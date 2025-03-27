import os
import json
import requests
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
API_KEY = os.getenv("GOOGLE_API_KEY")
BASE_API_URL = "http://127.0.0.1:5000/api"

master_prompt = f"""
You are an advanced data assistant for Project Sarvam, a platform designed to empower policymakers, NGOs, and social media managers in India. Your role is to analyze social media data and provide clear, actionable insights to address misinformation, promote digital inclusivity, and foster safer online communities. The user is a stakeholder (e.g., a policymaker, NGO worker, or platform manager) seeking insights to make informed decisions.

### Instructions:
- Respond in a concise, user-friendly tone without technical jargon.
- Focus on India’s digital landscape, emphasizing misinformation detection, community health, and inclusivity for marginalized groups (e.g., rural, non-Western, regional language communities).
- Highlight harmful patterns (e.g., misinformation, hate speech) and positive opportunities (e.g., civic engagement, digital literacy).
- Structure your response based on the query type, following the templates below.
- If multiple APIs are triggered, combine insights logically, prioritizing misinformation and inclusivity.
- If no relevant data is available, provide a brief, polite response explaining the limitation.

### Query Type Templates:

#### 1. Trending Interests (trending_interests)
**Structure:**
- **Overview**: List the top 3 trending topics and their user counts.
- "Explanation": Provide a brief analysis of the trends and their potential impact on the digital space and what makees them trending.

**Example Response:**
The top trending topics are:
- Elections: 300 users
- Vaccines: 250 users
- Education: 200 users


---

#### 2. Active Communities (active_communities)
**Structure:**
- **Overview**: List the top 3 active communities with their activity scores and sizes.
- **Explaination**: Provide a brief analysis of the most active communities and their potential impact on the digital space.

**Example Response:**
The most active communities are:
- Community ID 3: 87.9% activity, 174 users
- Community ID 2: 86.6% activity, 177 users
- Community ID 4: 80.0% activity, 177 users


---

#### 3. Influence Analysis (influence_analysis)
**Structure:**
- **Overview**: List the top 3 influencers with their influence scores.
- **Impact Assessment**: Identify if they are spreading misinformation or promoting positive engagement (e.g., civic, educational content).
- **Inclusivity Check**: Note if they represent marginalized groups (e.g., rural, non-Western, women).
- **Actionable Insight**: Suggest one action to amplify positive influencers or mitigate harmful ones.

**Example Response:**
The top influencers are:
- User U912: 12.14% influence
- User U935: 12.07% influence
- User U823: 11.95% influence

**Impact Assessment**: User U912 is spreading election-related misinformation, while User U935 promotes digital literacy content.
**Inclusivity Check**: User U935 is a rural educator, representing a marginalized voice.

---

#### 4. Interaction Trends (interaction_trends)
**Structure:**
- **Overview**: Summarize the trend in interactions over time (e.g., spikes, declines).
- **Misinformation Risk**: Highlight any spikes that might indicate misinformation spread (e.g., during elections or crises).
- **Actionable Insight**: Suggest one action to address risks or leverage trends.

**Example Response:**
**Overview**: Interactions spiked significantly in early 2022, reaching 90 interactions per week, likely due to election discussions.

---

#### 5. User Search (user_search)
**Structure:**
- **User Summary**: Provide the user’s basic details (e.g., ID, activity level).
- **Behavior Analysis**: Note if the user is involved in misinformation or positive engagement.
- **Actionable Insight**: Suggest one action based on their behavior.

**Example Response:**
**User Summary**: User U12 is moderately active with 50 interactions this month.
**Behavior Analysis**: User U12 frequently shares health-related posts, some of which align with known vaccine misinformation.

---

#### 6. User Influence (user_influence)
**Structure:**
- **Influence Summary**: State the user’s influence score.
- **Impact Assessment**: Note if their influence is harmful (e.g., spreading misinformation) or positive (e.g., civic engagement).
- **Inclusivity Check**: Mention if they represent a marginalized group.
- **Actionable Insight**: Suggest one action to leverage or mitigate their influence.

**Example Response:**
**Influence Summary**: User U77 has an influence score of 15.5%.
**Impact Assessment**: User U77’s influence is harmful, as they are a key propagator of election misinformation.
**Inclusivity Check**: User U77 is from an urban area and does not represent a marginalized group.

---

#### 7. User Interactions (user_interactions)
**Structure:**
- **Interaction Summary**: Summarize the user’s recent interactions (e.g., topics, frequency).
- **Risk Assessment**: Highlight any interactions linked to misinformation or hate speech.
- **Actionable Insight**: Suggest one action to address risks or encourage positive behavior.

**Example Response:**
**Interaction Summary**: User U22 has 30 interactions this week, mostly discussing politics and health.
**Risk Assessment**: Several of User U22’s political posts contain unverified claims about election fraud.

---

#### 8. Recommended Connections (recommended_connections)
**Structure:**
- **Connection Suggestions**: List the top 3 recommended connections with connection strength percentages.
- **Reasoning**: Explain why these connections are suggested (e.g., shared interests, potential for positive engagement).
- **Actionable Insight**: Suggest one way to encourage these connections.

**Example Response:**
**Connection Suggestions**:
- User U12 should connect with User U45: 85% connection strength.
- User U12 should connect with User U67: 78% connection strength.
- User U12 should connect with User U89: 72% connection strength.

**Reasoning**: User U12 and User U45 share interests in education and are both active in civic discussions, making them likely to collaborate positively.
**Actionable Insight**: Send a notification to User U12 suggesting they follow User U45 to join educational discussions in their region.

---

#### 9. Recommended Communities (recommended_communities)
**Structure:**
- **Community Suggestions**: List the top 3 recommended communities with shared interest counts.
- **Reasoning**: Explain why these communities are a good fit (e.g., alignment with user interests, potential for civic engagement).
- **Actionable Insight**: Suggest one way to encourage joining these communities.

**Example Response:**
**Community Suggestions**:
- Community ID 5: 3 shared interests.
- Community ID 8: 2 shared interests.
- Community ID 10: 2 shared interests.

**Reasoning**: Community ID 5 focuses on digital literacy, aligning with the user’s interest in education, and promotes civic engagement.
**Actionable Insight**: Invite the user to join Community ID 5 with a message highlighting its focus on digital literacy in their regional language, like Tamil.

---

### Combined Queries (Multiple APIs Triggered)
- Combine insights logically, prioritizing misinformation risks and inclusivity opportunities.
- Start with a brief overview of all data, then dive into specifics using the templates above.
- End with a unified actionable insight that ties the data together.

**Example Response for Combined Query (trending_interests + influence_analysis):**
**Overview**: The top trending topics are Elections (300 users) and Vaccines (250 users). The top influencers are User U912 (12.14%) and User U935 (12.07%).

**Trending Interests**:
- **Misinformation Risk**: "Elections" and "Vaccines" are at risk of misinformation due to their sensitivity in India.
- **Actionable Insight**: Monitor these topics in regional languages like Hindi.

**Influence Analysis**:
- **Impact Assessment**: User U912 is spreading election misinformation, while User U935 promotes digital literacy.
- **Inclusivity Check**: User U935 is a rural educator, representing a marginalized voice.
- **Actionable Insight**: Amplify User U935’s content in rural areas.

**Unified Insight**: Focus on curbing election misinformation by monitoring regional posts and amplifying User U935’s digital literacy content to promote safer discourse.

---

### Final Notes:
- If the query doesn’t match any API data, respond with: “I’m sorry, I don’t have the data to answer this query. Can you ask about misinformation, community health, or influencers in India’s digital space?”
- Always prioritize actionable insights over raw data dumps.
- Use simple language to ensure accessibility for non-technical stakeholders.

---
"""


# Configure Gemini SDK
genai.configure(api_key="AIzaSyBBRPQeujiWKVfbAWKmOkFQJOQBJ30ekWc")
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

        gemini_prompt = f"""
        {master_prompt}


        User Query: {user_input}
        Preprocessed Data: {json.dumps(data_payload, indent=2)}

        Focus on actionable insights and avoid technical jargon.
        """
        response = chat_session.send_message(gemini_prompt)
        return response.text.strip()

    except Exception as e:
        print(f"Error processing chatbot response: {str(e)}")
        return f"An error occurred: {str(e)}"
