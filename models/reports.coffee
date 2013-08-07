mongoose = require('mongoose')
mongoose.connect('mongodb://212.71.249.18/brittyscenes');

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

exports.addReport = (report, callback) ->
  reports.find {code: code}, (err, reports) -> #check that code does not already exist
    if (err || reports.length == 0)
      # yay not found
      reports.save report, (err, saved) ->
          if( err || !saved )
            callback(false)
          else callback(true)

exports.getReportByCode = (code, callback) ->
  reports.find {code: code}, (err, reports) ->
    if (err || reports.length == 0)
      callback(false)
    else
      callback(reports)