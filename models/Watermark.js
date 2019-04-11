const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const WatremarkSchema = new Schema({
  title: {
    type: String,
  },
  in: {
    type: String,
  },
  position: {
    type: String
  },
  x: {
    type: String
  },
  y: {
    type: String
  },
  top: {
    type: String
  },
  left: {
    type: String
  },
  right: {
    type: String
  },
  bottom: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Watermark = mongoose.model("wartermark", WatremarkSchema);