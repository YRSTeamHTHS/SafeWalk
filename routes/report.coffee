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
  code = req.body.code;
  type = req.body.type;
  #setup server
  databaseUrl = "brittyscenes"; #"username:password@example.com/mydb"
  collections = ["reports"]
  db = require("mongojs").connect(databaseUrl, collections);
  console.log db
  db.reports.save(
    code: code
    type: type,
    (err, saved) ->
      if( err || !saved )
        console.log("User not saved");
      else console.log("User saved");
  )
  res.redirect("")

exports.getall = (req, res) ->
  db.reports.find({sex: "female"}, (err, users) ->
    if( err || !users)
      console.log("No female users found");
    else users.forEach( (femaleUser) ->
      console.log(femaleUser);
    )
  )