from lxml import etree
import math
import json
import csv

def distance(lat1, lon1, lat2, lon2):
    R = 3956.6
    dLat = math.radians(lat2-lat1)
    dLon = math.radians(lon2-lon1)
    lat1 = math.radians(lat1)
    lat2 = math.radians(lat2)
    a = math.sin(dLat/2) * math.sin(dLat/2) + math.sin(dLon/2) * math.sin(dLon/2) * math.cos(lat1) * math.cos(lat2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    d = R * c
    return d

def distance_quick(lat1, lon1, lat2, lon2):
    return math.sqrt(math.pow(lat1-lat2, 2) + math.pow(lon1-lon2, 2))

doc = etree.parse('map.osm')

# Extract all nodes from XML
nodes_xml = doc.findall('node')
nodes = {}
node_ways = {}
for node_xml in nodes_xml:
    data = {}
    data['lat'] = float(node_xml.attrib['lat'])
    data['lon'] = float(node_xml.attrib['lon'])
    ref = int(node_xml.attrib['id'])
    nodes[ref] = data
    node_ways[ref] = []

# Tag nodes with the ways associated with them
ways = doc.findall('way')
for way in ways:
    nds = way.findall('nd')
    wayid = int(way.attrib['id'])
    for nd in nds:
        ref = int(nd.attrib['ref'])
        node_ways[ref].append(wayid)
        prev = ref

# Find intersections, where multiple ways meet at a node
intersections = {}
for ref, node in node_ways.iteritems():
    if len(node) > 1:
        intersections[ref] = nodes[ref]
        intersections[ref]['crimes'] = []

# Map saved crime data to intersections
with open('2013-06-greater-manchester-street.csv', 'rb') as f:
    reader = csv.DictReader(f)
    count = 0
    length = 27800
    for row in reader:
        count += 1
        minDistance = -1
        minId = -1
        for id in intersections.keys():
            d = distance_quick(float(row['lat']), float(row['lon']), intersections[id]['lat'], intersections[id]['lon'])
            if d < minDistance or minDistance == -1:
                minDistance = d
                minId = id
        intersections[minId]['crimes'].append(row['type'])
        if (count % 30) == 0:
            print str((float(count)/length)*100) + "%"

with open('intersections.json', 'w') as f:
    json.dump(intersections, f)

# Find connections between intersections
connections = {num: [] for num in intersections.keys()}
for way in ways:
    wayid = int(way.attrib['id'])
    prev_intersection = -1
    prev_lat = -1
    prev_lon = -1
    length = 0
    prev = []
    
    # Try to get name of road
    name = 'Unnamed road'
    tags = way.findall('tag')
    for tag in tags:
        if tag.attrib['k'] == 'name':
            name = tag.attrib['v']
    
    # Walk down road and identify intersection connections
    nds = way.findall('nd')
    for nd in nds:
        ref = int(nd.attrib['ref'])
        lat = float(nodes[ref]['lat'])
        lon = float(nodes[ref]['lon'])
        length = 0
        if len(prev) > 0:
            length = length + distance(prev[-1]['lat'], prev[-1]['lon'], lat, lon)
        if ref in intersections:
            if prev_intersection != -1:
                connections[ref].append({'id': prev_intersection, 'distance': length, 'road_id': wayid, 'road_name': name, 'path': prev})
                connections[prev_intersection].append({'id': ref, 'distance': length, 'road_id': wayid, 'road_name': name, 'path': prev})
            prev_intersection = ref
            length = 0
            prev = []
        else:
            prev.append({'id': ref, 'lat': lat, 'lon': lon})

with open('connections.json', 'w') as f:
    json.dump(connections, f)