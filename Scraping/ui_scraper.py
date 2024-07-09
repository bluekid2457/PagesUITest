import json
import os
import sys
from datetime import datetime
# import lxml
from bs4 import BeautifulSoup
# Create the directory if it does not  exist

def process_file(file_name):
    print(f"Processing file: {file_name}")
    # Add your file processing logic here
def merge_dictionaries(dict1, dict2):
    merged_dict = {}
    all_keys = set(dict1.keys()).union(dict2.keys())  # Get all unique keys
    for key in all_keys:
        merged_dict[key] = int(dict1.get(key, 0)) + int(dict2.get(key, 0))
    return merged_dict

def uploadData(directory,file_name,data):

    if not os.path.exists(directory):
        os.makedirs(directory)
    
    file_path = os.path.join(directory, file_name)

    with open(file_path, 'w') as json_file:
        json.dump(data, json_file)

    print(f"Created {file_path}") 
def read_json(file_name):
    """Read JSON data from a file."""
    with open(file_name, 'r') as file:
        data = json.load(file)
    return data
if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python process_client_file.py <file_name>")
        sys.exit(1)
        file_name = "ui_reports/AdminSettings_1.html"
    else:
        file_name = "ui_reports/"+sys.argv[1]
    file_type = sys.argv[1].split('_')[0]
    print(file_type)
    print(file_name)
    iteration_number = file_name.split('_')[-1].split('.')[0]
    print(iteration_number)
    p = open(file_name , 'r')
    contents = p.read()
    # parse html content 
    soup = BeautifulSoup(contents, 'html.parser') 
    tags = {tag.name for tag in soup.find_all()} 
    text = []
    for tag in tags: 
        for i in soup.find_all( tag ): # find all element of tag 
            if i.has_attr( "class" ): # if tag has attribute of class 
                if len( i['class'] ) != 0: 
                    class_name = i['class'][0]
                    if class_name == "card-footer":
                        text.append(i.text)
    
    test_data = text[0].strip().split()
    test_passed = int(test_data[0])
    test_failed = int(test_data[3])
    test_skipped = int(test_data[-4])
    test_other = int(test_data[-2])
    print( test_passed ,test_failed ,test_skipped,test_other)
    event_data = text[1].strip().split()
    event_passed = int(event_data[0])
    event_failed = int(event_data[3])
    event_other = int(event_data[6])
    print(event_passed,event_failed,event_other)

    ui_json = read_json("Latest/ui.json")
    temp_data = {}
    for i in ["test_passed", "test_failed", "test_skipped", "test_other","event_failed","event_passed","event_other"]:
        temp_data[i] = locals()[i]
    try:
        ui_json[str(iteration_number)]["total"] = merge_dictionaries(ui_json[str(iteration_number)]["total"],temp_data)
    except:
        ui_json[str(iteration_number)]["total"] = merge_dictionaries(ui_json["0"],temp_data)
    ui_json[str(iteration_number)][file_type] = temp_data
    uploadData("Latest","ui.json",ui_json)  