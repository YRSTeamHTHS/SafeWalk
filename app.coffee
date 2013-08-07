###
  Module dependencies.
###

#plugins to include
express = require('express')
app = express()

http = require('http')
server = http.createServer(app)
io = require('socket.io').listen(server)

path = require('path')
parseString = require('xml2js').parseString
mongoose = require('mongoose')

#models
#models = require('./models')
require('./models/reports').attach(io)

#controller files
routes = require('./routes')
user = require('./routes/user')
report = require('./routes/report')
map = require('./routes/map')
navigate = require('./routes/navigate')

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
app.use('/shared', express.static(path.join(__dirname, 'shared')));

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
app.get('/navigate/searchmap', navigate.searchmap)
app.get('/report', report.index)
app.get('/report/getall', report.getall)
app.post('/report/submit', report.submit)

###
app.get '/parse', (req, res) ->
  res.send 'abc'
  res.send 'def'
###

server.listen(
  app.get('port')
  () ->
    console.log('Express server listening on port ' + app.get('port'));
)
