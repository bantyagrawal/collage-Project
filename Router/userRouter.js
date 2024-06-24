const express = require('express');
const multer = require('multer');

const { 
  signup,
  login, 
  changePassword, 
  sendOtp, 
  verifyStudent, 
  getRecommendedBook, 
  getAllBooks, 
  asignBook, 
  studentExpireBook,
  uploadFile
} = require('../Controller/userController');
const { userVarification } = require('../Middleware/middleware');
const upload = multer({storage : multer.memoryStorage() });

const userRouter = express.Router();

userRouter.post('/signup', signup);
userRouter.post('/login', login);
userRouter.post('/changepassword', userVarification, changePassword);
userRouter.post('/sendotp',sendOtp);
userRouter.post('/verifystudent', verifyStudent);
userRouter.get('/getrecommendedbook', userVarification, getRecommendedBook);
userRouter.get('/getallbooks', userVarification, getAllBooks);
userRouter.post('/asignbook', userVarification, asignBook);
userRouter.get('/expirebook', userVarification, studentExpireBook);
userRouter.post('/upload', upload.single('file'), uploadFile);
module.exports = {
  userRouter,
};
