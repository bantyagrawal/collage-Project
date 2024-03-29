const express = require('express');
const { signupAdmin, loginAdmin, adminOtp, adminVerify, addCourse, getAllCourse, addBook, updateBook, sendOtpToUserForVerifyAsignBook, verifyAsignedBook, } = require('../Controller/adminController');
const { adminVerification } = require('../Middleware/middleware');
const adminRouter = express.Router();

adminRouter.post('/signupadmin', signupAdmin);
adminRouter.post('/loginadmin', loginAdmin);
adminRouter.get('/adminotp', adminOtp);
adminRouter.get('/verifyadmin', adminVerify);
adminRouter.post('/addcourse', adminVerification, addCourse);
adminRouter.get('/allcourse', getAllCourse);
adminRouter.post('/addbook', adminVerification, addBook);
adminRouter.put('/updatebook', adminVerification, updateBook);
adminRouter.post('/sendotptoverifyasignbook', adminVerification, sendOtpToUserForVerifyAsignBook);
adminRouter.put('/verifyasignbook', adminVerification, verifyAsignedBook);

module.exports = {
    adminRouter,
}

