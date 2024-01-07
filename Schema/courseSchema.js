const { Schema, model } = require('mongoose');

const courseSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    branch: {
        type: [String],
        required: true,
    },
    semester: {
        type: [Number],
        default: null,
    },
},
    { timestamps: true },
);

const courseModel = model('Course', courseSchema);

module.exports = {
    courseModel,
}