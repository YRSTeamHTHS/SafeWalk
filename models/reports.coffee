mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/brittyscenes');
#mongoose.connect('mongodb://212.71.249.18/brittyscenes');
io = undefined

# Creates a new Mongoose Schema object
Schema = mongoose.Schema;

#Collection to hold users
reportSchema = new Schema(
  code: { type: String, required: true }
  type: { type: String, required: true }
  comment: {type: String, required: true}
  versionKey: false
);

#Creates the Model for the User Schema
reports = mongoose.model('reports', reportSchema); #attach the schema if required for the first time

exports.attach = (io2) ->
  io = io2

###
  @param report magic
###
exports.addReport = (report, callback) ->
  #broadcast the new event
  io.sockets.emit('livereport', { report: report })
  callback()
  ###reports.find {code: code}, (err, reports) -> #check that code does not already exist
    if (err || reports.length == 0)
      # yay not found, save the report
      reports.save report, (err, saved) ->
          if( err || !saved )
            callback(false)
          else
            #broadcast the new event
            io.sockets.on('connection', (socket) ->
              socket.emit('livereport', { report: saved });
            )
            callback(true)###


exports.getReportByCode = (code, callback) ->
  reports.find {code: code}, (err, reports) ->
    if (err || reports.length == 0)
      callback(false)
    else
      callback(reports)