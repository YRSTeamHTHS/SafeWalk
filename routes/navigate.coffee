astar = (start, end) ->
  if not intersections.hasOwnProperty(start)
    return false

  # Copy the array of intersections
  nodes = []
  for id, node of intersections
    new_node = []
    for prop, val of node
      new_node[prop] = val
    new_node.closed = false
    new_node.id = id
    nodes[id] = new_node
  open_nodes = [start]
  start_node = nodes[start]
  end_node = nodes[end]
  start_node.g = calcWeight(start_node.crimes, start_node.reports)
  start_node.f = start_node.g + distance(start_node.lat, start_node.lon, end_node.lat, end_node.lon)

  count = 0
  while open_nodes.length > 0
    count++
    # Sort the working nodes by f
    open_nodes.sort (idA, idB) ->
      fA = nodes[idA].f
      fB = nodes[idB].f
      if fA < fB then return -1
      if fA > fB then return 1
      return 0

    current_id = open_nodes[0]
    current_node = nodes[current_id]
    if current_id == end
      return "Complete after " + count + " iterations"

    open_nodes.splice(0, 1)
    current_node.closed = true

    for neighbor in connections[current_id]
      neighbor_id = neighbor.id
      neighbor_node = nodes[neighbor_id]
      dist_between = neighbor.distance
      tentative_g_score = current_node.g + dist_between + calcWeight(neighbor.crimes, neighbor.reports)

      if neighbor_node.closed and (tentative_g_score >= neighbor_node.g)
        continue

      if (neighbor_id not in open_nodes) or (tentative_g_score < neighbor_node.g)
        neighbor_node.parent = current_id
        neighbor_node.g = tentative_g_score
        neighbor_node.f = tentative_g_score + distance(neighbor_node.lat, neighbor_node.lon, end_node.lat, end_node.lon)
        if neighbor_id not in open_nodes
          open_nodes.push(neighbor_id)

  return "Could not find after " + count + " iterations"

distance = (lat1, lon1, lat2, lon2) ->
  R = 3956.6
  dLat = toRad(lat2-lat1)
  dLon = toRad(lon2-lon1)
  lat1 = toRad(lat1)
  lat2 = toRad(lat2)
  a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2)
  c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  d = R * c
  return d

toRad = (deg) ->
  return deg * Math.PI / 180

calcWeight = (arrayCrimes, arrayReports) ->
  # TODO: implement intersection weight calculation
  return 0

# Load navigation data from JSON file
console.log("Loading intersections")
intersections = require('../data/intersections.json')
console.log("Loading connections")
connections = require('../data/connections.json')
console.log("Loading crime data")
crime_data = require('../data/crime.json')
crime_types = require('../shared/crime_types.json')
console.log("Loading reports")
reports = [] # TODO: fetch from database
console.log("Processing")

# Map crime data to intersections
#for item in crime_data
#  lat = item.Latitude
#  lon = item.Longitude
#  type = crime_types[item['Crime type']]
#  distances = []
#  for id, intersection of intersections
#    distances.push([id, distance(lat, lon, intersection.lat, intersection.lon)])
#  distances.sort (itemA, itemB) ->
#    if itemA[1] < itemB[1] then return -1
#    if itemA[1] > itemB[1] then return 1
#    return 0
#  intersection = intersections[distances[0][0]]
#  if "crimes" not in intersection then intersection.crimes = []
#  intersection.crimes.push(type)

exports.nav = (req, res) ->
  start = parseInt(req.query.start)
  end = parseInt(req.query.end)
  res.send(astar(start, end))