require "coffee-script"
intersections_model = require('../models/intersections_model.coffee')

module.exports = (callback) ->
  console.log "Reading data"
  intersections_data = require('./intersections.json')
  intersectionsArray = []

  console.log "Preparing data"
  for id, data of intersections_data
    intersection =
      'id': id
      'loc': {type: "Point", coordinates: [data['lon'], data['lat']]}
      'crimes': data['crimes']
    intersectionsArray.push intersection

  console.log "Sample", intersectionsArray[1000]

  console.log "Deleting old entries"

  intersections_model.drop () ->
    console.log "Adding to database", intersectionsArray.length
    intersections_model.import intersectionsArray, () ->
      console.log "Done"
      setTimeout callback, 2000