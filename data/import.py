from lxml import etree
doc = etree.parse('map.osm')

nodes_xml = doc.findall('node')
nodes = {}
node_ways = {}
print "Nodes", len(nodes_xml)
for node_xml in nodes_xml:
    data = {}
    data['lat'] = node_xml.attrib['lat']
    data['lon'] = node_xml.attrib['lon']
    ref = node_xml.attrib['id']
    nodes[ref] = data
    node_ways[ref] = []
ways = doc.findall('way')
for way in ways:
    nds = way.findall('nd')
    wayid = way.attrib['id']
    for nd in nds:
        node_ways[nd.attrib['ref']].append(wayid)
intersections = []
for ref, node in node_ways.iteritems():
    if len(node) > 1:
        intersections.append(ref)
print "Intersections", len(intersections)