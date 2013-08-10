mongoose = require('./model_model')
#mongoose.set('debug', true)
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
  loc: {type: mongoose.Schema.Types.Mixed, index: '2dsphere'},
  crimes: [String],
  reports: [reportSchema]
})
model = mongoose.model('intersections', intersectionSchema)
readyListeners = []
data = null

#model.find {}, (err, intersections) ->
#  if (err || intersections.length == 0)
#    console.log err
#  else
#    console.log "Loaded saved intersection data of length", intersections.length
#    data = new IntersectionsData(intersections)
#    exports.intersections = data.data
#    for callback in readyListeners
#      callback()

ready = false
exports.onReady = (callback) ->
  if ready
    callback()
  else
    readyListeners.push callback

exports.import = (intersectionArray, callback) ->
  model.create intersectionArray, (err) ->
    console.log err
    data = new IntersectionsData(intersectionArray)
    exports.intersections = data.data
    ready = true
    for readyCallback in readyListeners
      readyCallback()
    callback()

exports.getNearest = (lat, lon, callback) ->
  selector =
    loc:
      '$near':
        '$geometry':
          type: 'Point'
          coordinates: [lon, lat]
  model.findOne selector, (err, result) ->
    callback result

exports.update = (intersection_id, update, callback) ->
  data.update intersection_id, update
  model.update {id: intersection_id}, {$pushAll: update}, (err) ->
    if callback?
      callback err

exports.drop = (callback) ->
  model.remove (err) ->
    console.log "Intersections database dropped"
    callback()