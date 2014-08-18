mongoose = require('mongoose')

if process.env.MONGO_URL?
  url = process.env.MONGO_URL
else if process.env.MONGOLAB_URI?
  url = process.env.MONGOLAB_URI
else
  url = 'mongodb://localhost/brittyscenes'

try
  mongoose.connect(url)
catch e
  console.log e
  console.log "Already connected"

module.exports = mongoose