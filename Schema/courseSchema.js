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
    isSemester: {
        type: Boolean,
        default: true,
    },
    semester: {
        type: Number,
        default: null,
    },
    year: {
        type: Number,
        default: null
    }
},
    { timestamps: true },
);

const courseModel = model('Course', courseSchema);

module.exports = {
    courseModel,
}