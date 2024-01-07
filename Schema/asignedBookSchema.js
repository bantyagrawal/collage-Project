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
            console.log('ASSIGNED DATE', assignedDate);
            return assignedDate + 7 * 24 * 60 * 60 * 1000;
        }
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
})

const asignedBookModel = model('AsignedBook', asignedBookSchema);

module.exports = {
    asignedBookModel,
}