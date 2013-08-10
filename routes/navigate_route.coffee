map_model = require('../models/map_model')
intersections_model = require('../models/intersections_model')
#intersections = intersections_model.intersections
connections = map_model.connections

astar = (start, end) ->
  console.log 'navigate_route', start, end
  # Copy the array of intersections
  nodes = {}
  foundStart = false
  foundEnd = false
  count = 0
  intersections_model.intersections.each (node) ->
    count++
    if node['id'] == start then foundStart = true
    if node['id'] == end then foundEnd = true
    new_node = {}
    new_node['id'] = node['id']
    new_node['reports'] = node['reports']
    new_node['crimes'] = node['crimes']
    new_node['lat'] = node['loc']['coordinates'][1]
    new_node['lon'] = node['loc']['coordinates'][0]
    new_node['closed'] = false
    nodes[node['id']] = new_node
  #if !(foundStart and foundEnd) then return false
  open_nodes = [start]
  start_node = nodes[start]
  end_node = nodes[end]
  start_node.g = calcWeight(start_node.crimes, start_node.reports)
  start_node.f = start_node.g + distance(start_node.lat, start_node.lon, end_node.lat, end_node.lon)

  count = 0
  while open_nodes.length > 0
    count++
    console.log 'navigate_route', open_nodes
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
      return reconstructRoute(nodes, start, end)

    open_nodes.splice(0, 1)
    current_node.closed = true

    for neighbor in connections[current_id]
      neighbor_id = neighbor.id
      neighbor_node = nodes[neighbor_id]
      dist_between = neighbor.distance
      tentative_g_score = current_node.g + dist_between + calcWeight(neighbor_node.crimes, neighbor_node.reports)

      if neighbor_node.closed and (tentative_g_score >= neighbor_node.g)
        continue

      if (neighbor_id not in open_nodes) or (tentative_g_score < neighbor_node.g)
        neighbor_node.parent = current_id
        neighbor_node.g = tentative_g_score
        neighbor_node.f = tentative_g_score + distance(neighbor_node.lat, neighbor_node.lon, end_node.lat, end_node.lon)
        neighbor_node.road_name = neighbor.road_name
        neighbor_node.road_id = neighbor.road_id
        neighbor_node.path = neighbor.path
        if neighbor_id not in open_nodes
          open_nodes.push(neighbor_id)

  return "Could not find after " + count + " iterations"

reconstructRoute = (nodes, start, end) ->
  # Build route in forwards direction by stepping backwards on route
  current_id = end
  first = true
  route = []
  while current_id != start
    if !first
      current_id = nodes[current_id].parent
    first = false
    route.push(nodes[current_id])
  route = route.reverse()

  # Flatten route into polyline and unique roads
  path = []
  roads = []
  current_road = -1
  for item in route
    if item.path? then path = path.concat(item.path)
    basic_item =
      id: item['id']
      lat: item['loc']['coordinates'][1]
      lon: item['loc']['coordinates'][0]
    path.push(basic_item)
    if item.road_id? and item.road_id != current_road
      roads.push({'id': item.road_id, 'name': item.road_name})
      current_road = item.road_id

  return {'route': route, 'path': path, 'roads': roads}

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
  # TODO: fix array calculation
  return arrayCrimes.length

exports.nav = (req, res) ->
  start = parseInt(req.query.start)
  end = parseInt(req.query.end)
  res.send(astar(start, end))

exports.navCoordinates = (req, res) ->
  lat1 = parseFloat(req.body.lat1)
  lon1 = parseFloat(req.body.lon1)
  lat2 = parseFloat(req.body.lat2)
  lon2 = parseFloat(req.body.lon2)

  # Search for nearest intersection to each
  intersections_model.getNearest lat1, lon1, (result) ->
    from = result
    intersections_model.getNearest lat2, lon2, (result) ->
      to = result
      if from?.id? and to?.id?
        console.log from.id, to.id
        res.send(astar(from.id, to.id))

exports.searchmap = (req,res) ->
  search = (req.query.search);
  res.send("<map here>")
