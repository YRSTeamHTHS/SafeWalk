intersections_model = require('../models/intersections_model.coffee')

intersections_data = require('./intersections.json')
intersectionsArray = []

for id, data of intersections_data
  intersection =
    'id': id
    'loc': {'type': 'Point', coordinates: [data['lon'], data['lat']]}
    'crimes': data['crimes']
  intersectionsArray.push intersection

intersections_model.addMultiple(intersectionsArray)