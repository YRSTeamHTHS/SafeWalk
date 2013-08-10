IntersectionsData = require('../shared/IntersectionsData')
reports_model = require('../models/reports_model')

# Load navigation data from JSON file
console.log("Loading intersections")
intersections = require('../models/intersections_model')
console.log("Loading connections")
exports.connections = require('../data/connections.json')
console.log("Loading crime data")
exports.crime_types = require('../shared/crime_types.json')

intersections.onReady () ->
  console.log("Loading reports")
  reports_model.getAllReports (reports) ->
    for report in reports
      addNewReport report
    console.log("Reports done loading")

reports_model.addListener (report) ->
  addNewReport report

addNewReport = (report) ->
  intersections.update(report.id, {reports: [report]})