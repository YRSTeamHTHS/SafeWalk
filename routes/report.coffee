###
  report form functions

  renders and processes the report form
###

###
  renders the default form of the registration
  @param req      request
  @param res      resource to render
###
exports.reportform = (req, res)->
  types = ['meow','moo','quack','ribbet','woof']
  console.log('poop');
  res.render('reportform', { types: 'types' })