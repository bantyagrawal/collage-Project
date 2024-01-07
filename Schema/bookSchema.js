const { Schema, model } = require('mongoose');

const bookSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    publicationYear: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        default: null,
    },
    course: {
        type: [{
            courseName: {
                type: String,
                required: true,
            },
            branch: {
                type: String,
                required: true,
            },
            semester: {
                type: Number,
                default: null,
            },
            year: {
                type: Number,
                default: null,
            }
        }],
        default: []
    }
},
{timestamps: true},
);

const bookModel = model('book', bookSchema);

module.exports = {
    bookModel,
}