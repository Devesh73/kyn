import random
import json
from faker import Faker
from datetime import datetime, timedelta
import pandas as pd
import argparse

fake = Faker()


def generate_users(num_users=1000):
    """Generate realistic fake user data."""
    users = []
    for i in range(num_users):
        creation_date = fake.date_this_decade()
        followers = random.randint(0, 1000)
        following = random.randint(0, 1000)
        users.append(
            {
                "id": i,
                "name": fake.name(),
                "email": fake.email(),
                "bio": fake.text(max_nb_chars=150),
                "profile_picture": fake.image_url(),
                "location": fake.city(),
                "interests": random.sample(
                    [
                        "sports",
                        "music",
                        "tech",
                        "art",
                        "gaming",
                        "fitness",
                        "travel",
                        "cooking",
                        "finance",
                        "fashion",
                    ],
                    random.randint(2, 5),
                ),
                "account_created": creation_date.isoformat(),
                "followers": followers,
                "following": following,
            }
        )
    return users


def generate_interactions(users, num_interactions=20000):
    """Generate realistic fake interaction data."""
    interactions = []
    user_ids = [user["id"] for user in users]
    post_ids = [
        fake.uuid4() for _ in range(num_interactions // 2)
    ]  # Create random post IDs

    for _ in range(num_interactions):
        user1, user2 = random.sample(user_ids, 2)
        while user1 == user2:  # Ensure no user interacts with themselves
            user1, user2 = random.sample(user_ids, 2)
        interaction_type = random.choice(["like", "comment", "share", "view"])
        platform = random.choice(["Twitter", "Instagram", "Facebook", "LinkedIn"])
        interactions.append(
            {
                "user1": user1,
                "user2": user2,
                "post_id": random.choice(post_ids),
                "interaction_type": interaction_type,
                "platform": platform,
                "timestamp": fake.date_time_this_year().isoformat(),
                "interaction_weight": random.uniform(
                    0.1, 1.0
                ),  # Strength of the interaction
            }
        )
    return interactions


def generate_groups(users, num_groups=100):
    """Generate user groups based on shared interests."""
    groups = []
    group_id = 0
    for _ in range(num_groups):
        group_users = random.sample(users, random.randint(5, 20))
        common_interest = random.choice(group_users[0]["interests"])
        groups.append(
            {
                "group_id": group_id,
                "members": [user["id"] for user in group_users],
                "shared_interest": common_interest,
                "group_name": f"{common_interest.capitalize()} Enthusiasts Group",
            }
        )
        group_id += 1
    return groups


if __name__ == "__main__":
    # Parse arguments for flexibility
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--num_users", type=int, default=1000, help="Number of users to generate"
    )
    parser.add_argument(
        "--num_interactions",
        type=int,
        default=20000,
        help="Number of interactions to generate",
    )
    parser.add_argument(
        "--num_groups", type=int, default=100, help="Number of groups to generate"
    )
    args = parser.parse_args()

    # Generate data
    print("Generating users...")
    users = generate_users(num_users=args.num_users)

    print("Generating interactions...")
    interactions = generate_interactions(users, num_interactions=args.num_interactions)

    print("Generating user groups...")
    groups = generate_groups(users, num_groups=args.num_groups)

    # Save data to JSON and CSV
    output_dir = "../data/"
    print(f"Saving data to {output_dir}...")
    pd.DataFrame(users).to_json(
        f"{output_dir}fake_users.json", orient="records", indent=4
    )
    pd.DataFrame(interactions).to_json(
        f"{output_dir}fake_interactions.json", orient="records", indent=4
    )
    pd.DataFrame(groups).to_json(
        f"{output_dir}fake_groups.json", orient="records", indent=4
    )

    pd.DataFrame(users).to_csv(f"{output_dir}fake_users.csv", index=False)
    pd.DataFrame(interactions).to_csv(f"{output_dir}fake_interactions.csv", index=False)
    pd.DataFrame(groups).to_csv(f"{output_dir}fake_groups.csv", index=False)

    print("Data generation complete!")
