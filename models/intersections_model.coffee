mongoose = require('./model_model')()
IntersectionsData = require('../shared/IntersectionsData.js')

Schema = mongoose.Schema;
reportSchema = new Schema({
  id: Number,
  type: String,
  comment: String,
  time: {type: Date, 'default': Date.now}
})
intersectionSchema = new Schema({
  id: Number,
  loc: {type: Number, index: '2dsphere'},
  crimes: [String],
  reports: [reportSchema]
})
model = mongoose.model('intersections', intersectionSchema)
readyListeners = []
data = null

model.find {}, (err, intersections) ->
  if (err || intersections.length == 0)
    throw new Error()
  else
    console.log "Loaded saved intersection data"
    data = new IntersectionsData(intersections)
    exports.intersections = data.data
    for callback in readyListeners
      callback()


exports.onReady = (callback) ->
  readyListeners.push callback

exports.addMultiple = (intersectionArray) ->
  model.create intersectionArray, (err) ->
    console.log err

exports.update = (intersection_id, update, callback) ->
  data.update intersection_id, update
  model.update {id: intersection_id}, {$pushAll: update}, (err) ->
    if callback?
      callback err
