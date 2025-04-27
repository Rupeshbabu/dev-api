const mongoose = require('mongoose');

const CousreSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a course title']
    },
    description: {
        type: String,
        required: [true, 'please enter description']
    },
    weeks:{
        type: String,
        required: [true, 'Please add number of weeks']
    },
    tuitions: {
        type: Number,
        required: [true, 'Please add a tuition cost']
    },
    minimumSkill: {
        type: String,
        required: [true, 'Please add minimum skills'],
        enum: ['beginner', 'intermediate', 'advanced']
    },
    scholarshipAvailable: {
        type: Boolean,
        default: false
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    dev: {
        type: mongoose.Schema.ObjectId,
        ref: 'Dev',
        required: true
    }
});

module.exports = mongoose.model('Course', CousreSchema);