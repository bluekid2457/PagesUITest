import json
import os
from datetime import datetime

# Create the directory i f it does not  exist
directory = "APIData"
if not os.path.exists(directory):
    os.makedirs(directory)

# Create the JSON file with the current date
date_str = datetime.now().strftime("%Y-%m-%d")
file_name = f"report_{date_str}.json"
file_path = os.path.join(directory, file_name)

# Write the data to the JSON file
data = {"x": 123}
with open(file_path, 'w') as json_file:
    json.dump(data, json_file)

print(f"Created {file_path}")