const express = require('express');
const { signupAdmin, loginAdmin, adminOtp, adminVerify, addCourse, getAllCourse } = require('../Controller/adminController');
const { adminVerification } = require('../Middleware/middleware');
const adminRouter = express.Router();

adminRouter.post('/signupadmin', signupAdmin);
adminRouter.post('/loginadmin', loginAdmin);
adminRouter.get('/adminotp', adminOtp);
adminRouter.get('/verifyadmin', adminVerify);
adminRouter.post('/addcourse', adminVerification, addCourse);
adminRouter.get('/allcourse', getAllCourse);

module.exports = {
    adminRouter,
}

