mongoose = require('mongoose');

# Creates a new Mongoose Schema object
Schema = mongoose.Schema;

#Collection to hold users
reportSchema = new Schema(
  code: { type: String, required: true }
  type: { type: String, required: true }
  comment: {type: String, required: true},
  versionKey: false
);

reports = mongoose.model('reports', reportSchema); #attach the schema if required for the first time