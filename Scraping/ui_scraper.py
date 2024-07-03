import json
import os
import glob
from datetime import datetime
# import lxml
from bs4 import BeautifulSoup
# Create the directory if it does not  exist


def uploadData(directory,file_name,data):

    if not os.path.exists(directory):
        os.makedirs(directory)
    
    file_path = os.path.join(directory, file_name)

    with open(file_path, 'w') as json_file:
        json.dump(data, json_file)

    print(f"Created {file_path}") 


p = open('latest_reports/ui_report.html' , 'r')
contents = p.read()
# parse html content 
soup = BeautifulSoup(contents, 'html.parser') 
  
# get all tags 
tags = {tag.name for tag in soup.find_all()} 

data = {}
text = ""
# iterate all tags 
for tag in tags: 
    for i in soup.find_all( tag ): # find all element of tag 
        if i.has_attr( "class" ): # if tag has attribute of class 
            if len( i['class'] ) != 0: 
                class_name = i['class'][0]
                if class_name == "card-footer":
                    text += i.text
                
        

split_text = text.strip().split()
print(split_text)
test_passed = split_text[0]
test_failed = split_text[3]
test_skipped = split_text[6]
test_others = split_text[8]
event_passed = split_text[10]
event_failed = split_text[13]
event_others = split_text[16]
print (test_passed ,test_failed, test_skipped,test_others,event_passed,event_failed,event_others)
data = {"test_passed":test_passed ,"testfailed":test_failed, "test_skipped":test_skipped,
        "test_others":test_others,"event_passed":event_passed,"event_failed":event_failed,
        "event_other":event_others}

directory = "UIData" 
date_str =  datetime.now().strftime("%Y-%m-%d")
file_name = f"report_{date_str}.json"
uploadData(directory,file_name,data)
uploadData("Latest","ui.json",data)