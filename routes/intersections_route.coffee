map_model = require('../models/map_model')
intersections = map_model.intersections
connections = map_model.connections

exports.all = (req, res) ->
  res.send intersections