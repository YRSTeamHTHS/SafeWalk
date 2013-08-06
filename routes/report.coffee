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
