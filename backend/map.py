import json

# Load JSON data from a file
def load_json_file(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)
    return data

# Extract unique location names
def get_unique_locations(json_data):
    return list(json_data.keys())

# Main function
def main():
    file_path = "response.json"  # Replace with your JSON file path
    try:
        # Load JSON file
        data = load_json_file(file_path)
        
        # Get unique locations
        unique_locations = get_unique_locations(data)
        
        # Print unique locations
        print("Unique Locations:")
        for location in unique_locations:
            print(location)
        
        # Print the total number of unique locations
        print(f"\nTotal Number of Unique Locations: {len(unique_locations)}")
    except FileNotFoundError:
        print(f"File '{file_path}' not found. Please check the file path.")
    except json.JSONDecodeError:
        print(f"Error decoding JSON from file '{file_path}'. Please check the file format.")

# Run the script
if __name__ == "__main__":
    main()
