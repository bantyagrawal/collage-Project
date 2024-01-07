const Joi = require('joi');

const userRegistrationSchema = Joi.object({
  registrationNumber: Joi.string().required(),
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  mobile: Joi.string().required(),
  course: Joi.string().required(),
  address: Joi.string().required(),
  password: Joi.string().required(),
  semester: Joi.number(),
  year: Joi.number(),
  branch: Joi.string().required(),
  batch: Joi.string().required(),
});

const studentLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
})

const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().required()
})

const otpSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.number().required(),
})

const adminRegistrationSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  mobile: Joi.string().required(),
  address: Joi.string().required(),
  password: Joi.string().required(),
})

const courseSchema = Joi.object({
  name: Joi.string().required(),
  duration: Joi.number().required(),
  branch: Joi.array().items(Joi.string()).required(),
  semester: Joi.number(),
})

const bookSchema = Joi.object({
  name: Joi.string().required(),
  author: Joi.string().required(),
  publicationYear: Joi.number().positive().required(),
  price: Joi.number().positive().required(),
  image: Joi.string(),
  course: Joi.array(),
  totalBook: Joi.number().required()
})

const asignBookSchema = Joi.object({
  user: Joi.string().required(),
  book: Joi.string().required(),
  asignedDate: Joi.number(),
  expireDate: Joi.number(),
})

module.exports = {
  userRegistrationSchema,
  studentLoginSchema,
  changePasswordSchema,
  otpSchema,
  adminRegistrationSchema,
  courseSchema,
  bookSchema,
  asignBookSchema,
};
