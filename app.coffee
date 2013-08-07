###
  Module dependencies.
###

#plugins to include
express = require('express')
http = require('http')
path = require('path')
parseString = require('xml2js').parseString
mongoose = require('mongoose')

#models
#models = require('./models')

#controller files
routes = require('./routes')
user = require('./routes/user')
report = require('./routes/report')
map = require('./routes/map')
navigate = require('./routes/navigate')

app = express()

# all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser()); #retrieve json body
app.use(express.methodOverride());
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));

# development only
#if ('development' == app.get('env'))

app.configure('development', ()->
  app.use(express.errorHandler());
)

#url definitions
app.get('/', routes.index)
app.get('/users', user.list)
app.get('/map', map.index)
app.get('/report', report.index)
app.get('/navigate/nav', navigate.nav)
app.post('/report/submit', report.submit)

###
app.get '/parse', (req, res) ->
  res.send 'abc'
  res.send 'def'
###

http.createServer(app).listen(
  app.get('port')
  () ->
    console.log('Express server listening on port ' + app.get('port'));
)
