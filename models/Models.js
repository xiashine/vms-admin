const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ModelsSchema = new Schema({
  title: {
    type: String,
  },
  video: {
    type: String,
  },
  bitrate: {
    type: String
  },
  width: {
    type: String
  },
  height: {
    type: String
  },
  audio: {
    type: String
  },
  abitrate: {
    type: String
  },
  sampling: {
    type: String
  },
  format: {
    type: String
  },
  watermarkid: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Models = mongoose.model("models", ModelsSchema);