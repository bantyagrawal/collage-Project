const express = require('express');
const { signup, login, changePassword, sendOtp, verifyStudent } = require('../Controller/userController');
const { userVarification } = require('../Middleware/middleware');

const userRouter = express.Router();

userRouter.post('/signup', signup);
userRouter.post('/login', login);
userRouter.post('/changepassword', userVarification, changePassword);
userRouter.post('/sendotp',sendOtp);
userRouter.post('/verifystudent', verifyStudent);

module.exports = {
  userRouter,
};
