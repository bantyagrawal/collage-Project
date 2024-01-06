const express = require('express');
const { signupAdmin, loginAdmin, adminOtp, adminVerify, addCourse } = require('../Controller/adminController');
const { adminVerification } = require('../Middleware/middleware');
const adminRouter = express.Router();

adminRouter.post('/signupadmin',signupAdmin);
adminRouter.post('/loginadmin', loginAdmin);
adminRouter.get('/adminotp', adminOtp);
adminRouter.get('/verifyadmin', adminVerify);
adminRouter.post('/addcourse', adminVerification, addCourse);

module.exports = {
    adminRouter,
}

