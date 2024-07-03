import glob
import os
print(os.curdir)
list_of_files = glob.glob('C:/Users/ajua/Achint_Local_Coding/Scraping/hi/*') # * means all if need specific format then *.csv
print(list_of_files)
latest_file = max(list_of_files, key=os.path.getctime)
print(latest_file)