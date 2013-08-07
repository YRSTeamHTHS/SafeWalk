mongoose = require('mongoose')
mongoose.connect('mongodb://192.168.113.51/brittyscenes');
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
  versionKey: false
);

#Creates the Model for the User Schema
ReportModel = mongoose.model('reports', reportSchema); #attach the schema if required for the first time

exports.attach = (io2) ->
  io = io2

###
  @param report magic
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
          io.sockets.emit('livereport', { report: report })
          callback(true)
      )
    else callback(false)


exports.getReportByCode = (code, callback) ->
  ReportModel.find {code: code}, (err, reports) ->
    if (err || reports.length == 0)
      callback(false)
    else
      callback(reports)