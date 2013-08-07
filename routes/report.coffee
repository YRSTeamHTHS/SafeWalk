###
  report form functions

  renders and processes the report form
###

###
  renders the default form of the registration
  @param req      request
  @param res      resource to render
###
exports.index = (req, res)->
  types = ['meow','moo','quack','ribbet','woof']
  res.render('reportform', { types: types })

###
  saves data on form submit for later processing
  @param req.code   random code for identifying route
  @param req.type   report type

###
exports.submit = (req, res) ->
  shortcode = req.body.code;
  type = req.body.type;

  #check for valid code
  if _validateCode() #@todo validate code
    db = require("../models/reports"); #load the database
    abc = db.getReportByCode(shortcode, (data) ->
      console.log(data)
    )
    res.send(abc)

  return true


  #@todo insertion escaping


_validateCode = () ->
  return true

exports.getall = (req, res) ->
  db.reports.find({sex: "female"}, (err, users) ->
    if( err || !users)
      console.log("No female users found");
    else users.forEach( (femaleUser) ->
      console.log(femaleUser);
    )
  )