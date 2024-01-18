const { Schema, model } = require('mongoose');

const asignedBookSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Student',
    },
    book: {
        type: Schema.Types.ObjectId,
        ref: 'book',
    },
    asignedDate: {
        type: Number,
        default: Date.now,
    },
    expireDate: {
        type: Number,
        default: () => {
            const assignedDate = this.asignedDate || Date.now();
            return assignedDate + 7 * 24 * 60 * 60 * 1000;
        }
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    isVerify: {
        type: Boolean,
        default: false,
    },
    otp: {
        type: Number,
        default: null
    }
})

const asignedBookModel = model('AsignedBook', asignedBookSchema);

module.exports = {
    asignedBookModel,
}