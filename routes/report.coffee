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
    db = require("../models/config"); #load the database
    db.reports.find {code: shortcode},(err, reports) -> #check that code does not already exist
      if (err || reports.length == 0)
        console.log "null code"
        res.send("a")

  return true


  #@todo insertion escaping


  db.reports.save(
    code: code
    type: type,
    (err, saved) ->
      if( err || !saved )
        console.log("User not saved");
      else console.log("User saved");
  )
  res.redirect("")

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