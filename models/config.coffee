
mongoose = require('mongoose');

# Creates a new Mongoose Schema object
Schema = mongoose.Schema;

#Collection to hold users
reportSchema = new Schema(
  code: { type: String, required: true }
  type: { type: String, required: true }
  comment: {type: String, required: true},
  versionKey: false
);

#Creates the Model for the User Schema
try
  reports = mongoose.model('reports', reportSchema); #attach the schema if required for the first time
catch e
  reports = mongoose.model('reports'); #only attach functions if required more than once

  #getUserById = (id, callback) ->
   # report.findById(id, callback);

exports.addReport = (report, callback) ->
  reports.save(report,
    (err, saved) ->
      if( err || !saved )
        callback("User not saved");
      else callback("User saved");
  )

exports.getReportByCode = (code, callback) ->
  reports.find {code: code},(err, reports) -> #check that code does not already exist
    if (err || reports.length == 0)
      callback("null code");