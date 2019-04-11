const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const SourceinfoSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  path: {
    type: String
  },
  tags: {
    type: String
  },
  thumb: {
    type: String
  },
  parentid:{
    type: String,
    default:0
  },
  starttime:{
    type: String,
  },
  endtime:{
    type: String,
  },
  state: {
    type: String,
    default:0
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Sourceinfo = mongoose.model("sourceinfo", SourceinfoSchema);