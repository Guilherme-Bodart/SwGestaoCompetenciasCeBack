const mongoose = require('../../database');

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  about: {
    type: String,
    require: true,
  },
  responsible: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: true,
  },
  team: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    require: true,
    default:[]
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  endedAt: {
    type: Date,
  },
});

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;
