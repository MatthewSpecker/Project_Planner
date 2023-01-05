const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true } };

const TaskSchema = new Schema({
    title: String,
    description: String,
    deadline: String,
    sprint: String,
    performer: String,
    category: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, opts);

module.exports = mongoose.model('Task', TaskSchema); 