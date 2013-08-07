import csv
import json

data = []

with open('2013-06-greater-manchester-street.csv', 'rb') as f:
    reader = csv.DictReader(f)
    for row in reader:
        data.append(row)

with open('crime.json', 'w') as f:
    json.dump(data, f)