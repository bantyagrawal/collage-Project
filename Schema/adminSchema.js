const { Schema, model } = require('mongoose');

const adminSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    isSubadmin: {
        type: Boolean,
        default: false,
    },
    permission: {
        type: [String],
        default: null,
    },
    password: {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    otp: {
        type: String,
        default: null,
    }
})

const adminModel = model('admin', adminSchema);

module.exports = {
    adminModel,
}