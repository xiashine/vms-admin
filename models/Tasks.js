const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const TasksSchema = new Schema({
  infoid: {
    type:Schema.ObjectId,
    ref:'sourceinfo'
  },
  modelid: {
    type:Schema.ObjectId,
    ref:'models'
  },
  outpath: {
    type: String
  },
  percentage: {
    type: String
  },
  time: {
    type: String
  },
  duration: {
    type: String
  },
  size: {
    type: String
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

module.exports = Tasks = mongoose.model("tasks", TasksSchema);