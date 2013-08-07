databaseUrl = "brittyscenes"; #"username:password@example.com/mydb"
collections = ["reports"]
db = require("mongojs").connect(databaseUrl, collections);

module.exports = db;