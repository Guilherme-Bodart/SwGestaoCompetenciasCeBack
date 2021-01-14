const mongoose = require('../../database');

const TechnologySchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: true,
    },
    category: {
        type: String,
        require: true,
    },
    subCategory: {
        type: String,
        require: true,
    },
    nTasks: {
        type: Number,
        require: true,
        default: 0,
    },
});

const Technology = mongoose.model('Technology', TechnologySchema);

module.exports = Technology;
