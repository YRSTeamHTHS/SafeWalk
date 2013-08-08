IntersectionsData = require('../shared/IntersectionsData')

io = undefined
# Load navigation data from JSON file
console.log("Loading intersections")
exports.intersections = require('../data/intersections.json')
console.log("Loading connections")
exports.connections = require('../data/connections.json')
console.log("Loading crime data")
#exports.crime_data = require('../data/crime.json')
exports.crime_types = require('../shared/crime_types.json')
console.log("Loading reports")
exports.reports = [] # TODO: fetch from database
console.log("Processing")

exports.attach = (newIo) ->
  io = newIo
