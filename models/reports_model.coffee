mongoose = require('./model_model')

#mongoose.connect('mongodb://192.168.113.51/brittyscenes');
#mongoose.connect('mongodb://212.71.249.18/brittyscenes');
io = undefined

# Creates a new Mongoose Schema object
Schema = mongoose.Schema;

#Collection to hold users
#500MB cap
reportSchema = new Schema({
  id: { type: Number, required: true, trim: true },
  type: { type: String, required: true, trim: true },
  comment: {type: String, required: true, trim: true, min: 1, max: 140},
  time: {type: Date, "default": Date.now}},
  { capped: { size : 104857600, max : 10000, autoIndexId: true } }
#versionKey: false,
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
  #TODO: use a unique shortcode to prevent duplicates
  newreport = new ReportModel(report);
  newreport.save (err) ->
    if (err)
      callback(err)
    else
      #broadcast the new event
      report.time = Date.now()
      io.sockets.emit('livereport', { report: report })
      callListeners(report)
      callback(true)

listeners = []
exports.addListener = (callback) ->
  listeners.push callback

callListeners = (report) ->
  for callback in listeners
    callback report

###
  gets a report by code
  @param code       code to search for
  @param callback   callback to execute once completed
###
exports.getReportById = (id, callback) ->
  ReportModel.find {'id': id}, (err, reports) ->
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


###
  gets (limit) reports starting with (skip)
  @usedin         retrieval of older reports in live feed
  @param limit    max reports to retrieve
  @param skip     row to start retrieving reports from
  @return false of reports
  #TODO combine with getReports
###
exports.getReportsSkip = (limit, skip, callback) ->
  query = ReportModel.find({},{code:0})
  query.sort({_id:-1}).limit(limit).skip(skip)
  query.exec( (err, result) ->
    if (err)
      callback(false)
    else
      callback(result)
  )

###
  gets all reports in the database
  @param callback   callback function to execute on complettion
  @return false or reports
###
exports.getAllReports = (callback) ->
  query = ReportModel.find {}, (err, reports) ->
    if (err || reports.length == 0)
      callback false
    else
      callback reports