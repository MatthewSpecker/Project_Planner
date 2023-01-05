const mongoose = require('mongoose');
const User = require('./userModel');
const Task = require('./taskModel');
const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true } };

const ProjectSchema = new Schema({
    title: String,
    description: String,
    users: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    adminUsers:  [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    category: [String],
    tasks: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Task'
        }
    ]
}, opts);

module.exports = mongoose.model('Project', ProjectSchema); 