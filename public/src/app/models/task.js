const mongoose = require('../../database');

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    require: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: true,
  },
  completed: {
    type: Boolean,
    require: true,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  finishedAt: {
    type: Date,
  },
  frontend:{
    type:String,
  },
  backend:{
    type:String,
  },
  banco:{
    type:String,
  },
  about: {
    type: String,
  },
  category: {
    type: String,
    require: true,
  },
  subcategory: {
    type: String,
    require: true,
  },
});

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;
