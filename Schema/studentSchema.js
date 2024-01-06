const { Schema, model } = require('mongoose');

const studentSchema = new Schema(
  {
    registrationNumber: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    course: {
      type: String,
      required: true,
    },
    semester: {
      type: Number,
      default: null,
    },
    branch: {
      type: String,
      required: true,
    },
    batch: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      default: null,
    },
    address: {
      type: String,
      required: true,
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
      default: null,
    },
  },
  { timestamps: true },
);

const StudentModel = model('Student', studentSchema);

module.exports = {
  StudentModel,
};
