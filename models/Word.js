var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var WordSchema = new Schema({
  word_en: String,
  word_tr: String,
  word_level: String,
});

module.exports = mongoose.model("Word", WordSchema);
