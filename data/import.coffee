DATA_VERSION = "1"

require "coffee-script"
intersections_model = require('../models/intersections_model.coffee')
mongoose = require('../models/model_model')

Schema = mongoose.Schema;
infoSchema = new Schema({
  item: String
  value: String
})
model = mongoose.model('info', infoSchema)

module.exports = (callback) ->
  console.log 'import', "Reading data"
  intersections_data = require('./intersections.json')
  intersectionsArray = []

  console.log 'import', "Preparing data"
  for id, data of intersections_data
    intersection =
      'id': id
      'loc': {type: "Point", coordinates: [data['lon'], data['lat']]}
      'crimes': data['crimes']
    intersectionsArray.push intersection

  console.log 'import', "Sample", intersectionsArray[1000]
  console.log 'import', "Checking if database needs to be updated"

  model.find {item: 'DATA_VERSION', value: DATA_VERSION}, (err, results) ->
    if !err and results.length != 0
      console.log 'import', '...Up to date, continuing'
      intersections_model.importSkipDatbase(intersectionsArray)
      callback()
    else
      console.log 'import', '...Needs updating'
      console.log 'import', "Deleting old entries"
      intersections_model.drop () ->
        console.log 'import', "Adding to database", intersectionsArray.length
        intersections_model.import intersectionsArray, () ->
          console.log 'import', "Done"
          setting = new model({item: 'DATA_VERSION', value: DATA_VERSION})
          setting.save (err) ->
            setTimeout callback, 2000