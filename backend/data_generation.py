import os
import random
import json
from faker import Faker # type: ignore
from datetime import datetime, timedelta

# Initialize Faker
fake = Faker()

# Constants
NUM_USERS = 1000
NUM_INTERACTIONS = 20000
INTERESTS = [
    "Technology",
    "Fitness",
    "Music",
    "Travel",
    "Food",
    "Movies",
    "Books",
    "Gaming",
    "Art",
    "Fashion",
    "Education",
    "Health",
    "Sports",
    "Science",
    "Politics",
    "Environment",
    "History",
    "Photography",
    "Mental Health",
    "Parenting",
    "Startup Ideas",
    "Cryptocurrency",
    "Investing",
    "DIY",
    "Gardening",
    "Cooking",
    "Sustainability",
]
INTERACTION_TYPES = ["like", "comment", "share", "follow", "message"]


# Generate realistic users
def generate_users(num_users):
    users = []
    for i in range(num_users):
        user_id = f"U{i+1}"
        account_creation_date = fake.date_this_decade()
        activity_level = random.choices(
            ["low", "medium", "high"], weights=[50, 30, 20], k=1
        )[0]
        users.append(
            {
                "user_id": user_id,
                "name": fake.name(),
                "username": fake.user_name(),
                "email": fake.email(),
                "age": random.randint(16, 70),
                "location": fake.city(),
                "occupation": fake.job(),
                "bio": fake.sentence(nb_words=10),
                "interests": random.sample(INTERESTS, k=random.randint(3, 7)),
                "follower_count": random.randint(10, 10000),
                "following_count": random.randint(10, 10000),
                "activity_level": activity_level,
                "account_creation_date": account_creation_date.isoformat(),
                "last_active": (
                    account_creation_date + timedelta(days=random.randint(0, 365))
                ).isoformat(),
            }
        )
    return users


def generate_interactions(users, num_interactions):
    interactions = []
    user_map = {user["user_id"]: user for user in users}

    for i in range(num_interactions):
        source_user = random.choice(users)
        target_user = random.choice(users)

        # Avoid self-interaction
        while target_user["user_id"] == source_user["user_id"]:
            target_user = random.choice(users)

        interaction_type = random.choice(INTERACTION_TYPES)
        weight = {"like": 1, "comment": 2, "share": 3, "follow": 2, "message": 4}[
            interaction_type
        ]

        # Parse the account_creation_date to datetime
        source_creation_date = datetime.fromisoformat(
            source_user["account_creation_date"]
        )

        # Generate a realistic timestamp
        timestamp = fake.date_time_between(
            start_date=source_creation_date, end_date="now"
        ).isoformat()

        # Interaction probability increases with shared interests or same location
        shared_interests = set(source_user["interests"]) & set(target_user["interests"])
        geographic_proximity = source_user["location"] == target_user["location"]
        interaction_probability = len(shared_interests) * 0.2 + (
            0.3 if geographic_proximity else 0
        )

        if random.random() < interaction_probability:
            interactions.append(
                {
                    "interaction_id": f"I{i+1}",
                    "interaction_type": interaction_type,
                    "source_user": source_user["user_id"],
                    "target_user": target_user["user_id"],
                    "shared_interests": list(shared_interests),
                    "timestamp": timestamp,
                    "weight": weight,
                    "geographic_proximity": geographic_proximity,
                }
            )

    return interactions


# Save data to JSON
def save_data(users, interactions):
    os.makedirs("data", exist_ok=True)
    file_path = os.path.join("data", "social_media_data.json")
    data = {"users": users, "interactions": interactions}
    with open(file_path, "w") as f:
        json.dump(data, f, indent=4)
    print(f"Data saved to {file_path}")


# Main function
if __name__ == "__main__":
    print("Generating realistic users...")
    users = generate_users(NUM_USERS)

    print("Generating realistic interactions...")
    interactions = generate_interactions(users, NUM_INTERACTIONS)

    print("Saving data to file...")
    save_data(users, interactions)

    print(f"Generated {NUM_USERS} users and {len(interactions)} interactions.")
