###
  report form functions

  renders and processes the report form
###
db = require("../models/reports_model"); #load the database

###
  renders the default form of the registration
  @param req      request
  @param res      resource to render
###

###
exports.index = (req, res)->
  types = ['Suspicious Activity','Theft','Loitering','Traffic','Construction', 'Uneven Road']
  res.render('reportform', { types: types })
###

###
  saves data on form submit for later processing
  @param req.code   random code for identifying route
  @param req.type   report type

###
exports.submit = (req, res) ->
  id = req.body.id;
  type = req.body.type;
  comment = req.body.comment;

  #check for valid code
  if _validateCode() #@todo validate code

    data = {id:id,type:type,comment:comment}
    console.log data
    db.addReport(data,(result) ->
      console.log(result)
      res.send(result)
    )
    #console.log(data)


  return true


  #@todo insertion escaping


_validateCode = () ->
  return true

exports.getall = (req, res) ->
  db.getReports(20, (result) ->
    if result
      res.send(result)
  )

###
  used in dynamic loading of reports on scroll down in live feed
  db.getReportsSkip(limit,skip)
    gets maximimum of limit, skipping n records
###
exports.getLimitSkip = (req, res) ->
  skip = req.body.skip;
  console.log skip
  db.getReportsSkip(10, skip, (result) ->
    if result
      res.send(result)
  )

sms_regex = /^([0-9a-zA-Z]+)[,\n] *([a-zA-Z ])[,\n] *(.*)$/
exports.twilio = (req, res) ->
  message = req.body['Body']
  segments = message.match(sms_regex)
  if segments != null
    [shortcode, type, comment] = segments[1..]
    console.log "Incoming SMS", shortcode, type, comment
