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

model.find {}, (err, intersections) ->
  if (err || intersections.length == 0)
    console.log err
  else
    console.log "Loaded saved intersection data"
    data = new IntersectionsData(intersections)
    exports.intersections = data.data
    for callback in readyListeners
      callback()


exports.onReady = (callback) ->
  readyListeners.push callback

exports.addMultiple = (intersectionArray, callback) ->
  model.create intersectionArray, (err) ->
    console.log err
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