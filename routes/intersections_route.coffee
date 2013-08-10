map_model = require('../models/map_model')
intersections_model = require('../models/intersections_model')
connections = map_model.connections

exports.all = (req, res) ->
  console.log intersections_model.intersections
  res.send intersections_model.intersections