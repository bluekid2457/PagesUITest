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


p = open('latest_reports/api_report.html' , 'r')
contents = p.read()
# parse html content 
soup = BeautifulSoup(contents, 'html.parser') 
  
# get all tags 
tags = {tag.name for tag in soup.find_all()} 

data = {}
# iterate all tags 
for tag in tags: 
    for i in soup.find_all( tag ): # find all element of tag 
        if i.has_attr( "class" ): # if tag has attribute of class 
            if len( i['class'] ) != 0: 
                class_name = i['class'][0]
                match class_name:
                    case 'failed':
                        data["Failed"] = i.text.split()[0]
                    case 'passed':
                        data["Passed"] = i.text.split()[0]
                    case 'skipped':
                        data["Skipped"] = i.text.split()[0]
                    case 'xfailed':
                        data["Expected Fails"] = i.text.split()[0]
                    case 'xpassed':
                        data["Unexpected Passed"] = i.text.split()[0]
                    case 'error':
                        data["Errors"] = i.text.split()[0]
                    case 'rerun':
                        data["Reruns"] = i.text.split()[0]
        

print( data )
directory = "APIData" 
date_str =  datetime.now().strftime("%Y-%m-%d")
file_name = f"report_{date_str}.json"
uploadData(directory,file_name,data)
uploadData("Latest","api.json",data)