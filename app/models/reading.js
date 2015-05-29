/* Module dependencies */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReadingSchema = new Schema({
  sensor: {type: String},
  data: {},
  collectedAt: {type: Date, required: true}
});

/* Register */
mongoose.model('Reading', ReadingSchema);
