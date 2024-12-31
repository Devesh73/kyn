import random
import json
from faker import Faker

fake = Faker()

# Parameters for the dataset
NUM_USERS = 50
NUM_INTERACTIONS = 150
NUM_INTERESTS = 10

# Generate interests
interests = [fake.word() for _ in range(NUM_INTERESTS)]

# Generate users
users = [
    {
        "id": i,
        "name": fake.name(),
        "interests": random.sample(interests, random.randint(1, 3)),
    }
    for i in range(1, NUM_USERS + 1)
]

# Generate interactions
interactions = []
for _ in range(NUM_INTERACTIONS):
    user1 = random.choice(users)
    user2 = random.choice(users)
    if user1["id"] != user2["id"]:
        interactions.append(
            {
                "source": user1["id"],
                "target": user2["id"],
                "type": random.choice(["FOLLOW", "INTERACT"]),
            }
        )

# Save mock data to JSON
mock_data = {"users": users, "interactions": interactions}

with open("mock_dataset.json", "w") as file:
    json.dump(mock_data, file, indent=4)

print("Mock dataset saved as 'mock_dataset.json'")
