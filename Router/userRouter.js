const express = require('express');
const { 
  signup,
  login, 
  changePassword, 
  sendOtp, 
  verifyStudent, 
  getRecommendedBook, 
  getAllBooks, 
  asignBook 
} = require('../Controller/userController');
const { userVarification } = require('../Middleware/middleware');

const userRouter = express.Router();

userRouter.post('/signup', signup);
userRouter.post('/login', login);
userRouter.post('/changepassword', userVarification, changePassword);
userRouter.post('/sendotp',sendOtp);
userRouter.post('/verifystudent', verifyStudent);
userRouter.get('/getrecommendedbook', userVarification, getRecommendedBook);
userRouter.get('/getallbooks', userVarification, getAllBooks);
userRouter.post('/asignbook', userVarification, asignBook);

module.exports = {
  userRouter,
};
