mongoose = require('mongoose')

if process.env.MONGO_URL?
  url = process.env.MONGO_URL
else
  url = 'mongodb://localhost/brittyscenes'

mongoose.connect(url)
#mongoose.connect('mongodb://192.168.113.51/brittyscenes');
#mongoose.connect('mongodb://212.71.249.18/brittyscenes');
io = undefined

# Creates a new Mongoose Schema object
Schema = mongoose.Schema;

#Collection to hold users
reportSchema = new Schema({
  code: { type: String, required: true, trim: true },
  type: { type: String, required: true, trim: true },
  comment: {type: String, required: true, trim: true, min: 1, max: 140},
  time: {type: Date, "default": Date.now}},
  { capped: { size : 104857600, max : 10000, autoIndexId: true } }
#versionKey: false,
#500mb cap
);

#Creates the Model for the User Schema
ReportModel = mongoose.model('reports', reportSchema); #attach the schema if required for the first time

###
  retrieve the passed in socketio object, and make it locally accessable
  @param io2  socketio object to make accessable
###
exports.attach = (io2) ->
  io = io2

###
  add a new report to the database
  @param report     report containing code,type,comment parameters
  @param callback   callback to execute once completed
###
exports.addReport = (report, callback) ->
  #check that code does not already exist
  ReportModel.find {code: report.code}, (err, reports) ->
    if (err || reports.length == 0)
      console.log reports
      # yay not found, save the report
      newreport = new ReportModel(report);
      newreport.save( (err) ->
        if (err)
          callback(err)
        else
          #broadcast the new event
          report.time = Date.now()
          io.sockets.emit('livereport', { report: report })
          callback(true)
      )
    else callback(false)

###
  gets a report by code
  @param code       code to search for
  @param callback   callback to execute once completed
###
exports.getReportByCode = (code, callback) ->
  ReportModel.find {code: code}, (err, reports) ->
    if (err || reports.length == 0)
      callback(false)
    else
      callback(reports)

###
  gets all reports limited by quantity (limit)
  @param limit      maximum reports to retrieve
  @param callback   callback to execute once completed
###
exports.getReports = (limit, callback) ->
  query = ReportModel.find({},{code:0})
  query.sort({_id:-1}).limit(limit)
  query.exec( (err, result) ->
    if (err)
      callback(false)
    else
      result.reverse() #reverse array so that oldest to newest (allows use of prepend)
      callback(result)
  )

exports.getAllReports = (callback) ->
  query = ReportModel.find {}, (err, reports) ->
    callback null
