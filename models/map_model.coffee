IntersectionsData = require('../shared/IntersectionsData')
reports_model = require('../models/reports_model')

# Load navigation data from JSON file
console.log("Loading intersections")
exports.intersections = require('../data/intersections.json')
console.log("Loading connections")
exports.connections = require('../data/connections.json')
console.log("Loading crime data")
exports.crime_types = require('../shared/crime_types.json')
console.log("Loading reports")
for id, data of exports.intersections
  exports.intersections[id].reports = []
reports_model.getAllReports (reports) ->
  for report in reports
    addNewReport report
  console.log("Reports done loading")

reports_model.addListener (report) ->
  addNewReport report

addNewReport = (report) ->
  intersection = exports.intersections[report.id]
  if intersection?
    if !intersection.reports? then intersection.reports = []
    intersection.reports.push(report)