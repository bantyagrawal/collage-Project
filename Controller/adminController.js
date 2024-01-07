const { signupAdminService, adminLoginService, adminOtpService, addCourseService, adminVerifyService, getAllCourseService } = require("../Service/adminService")

const signupAdmin = async (req, res) => {
    try {
        const result = await signupAdminService(req.body);
        res.status(result.status).send(result);
    } catch (err) {
        res.status(err.status).send(err.message);
    }
}


const loginAdmin = async (req, res) => {
    try {
        const result = await adminLoginService(req.body);
        res.status(result.status).send(result);
    } catch (err) {
        res.status(err.status).send(err.message);
    }
}

const adminOtp = async (req, res) => {
    try {
        const result = await adminOtpService(req.body);
        res.status(result.status).send(result);
    } catch (err) {
        res.status(err.status).send(err.message);
    }
}

const adminVerify = async (req, res) => {
    try {
        const result = await adminVerifyService(req.body);
        res.status(result.status).send(result);
    } catch (err) {
        res.status(err.status).send(err.message)
    }
}

const addCourse = async (req, res) => {
    try {
        const result = await addCourseService(req.body);
        res.status(result.status).send(result);
    } catch (err) {
        res.status(err.status).send(err.message);
    }
}

const getAllCourse = async (req, res) => 
{
    try {
        const result = await getAllCourseService();
        res.status(result.status).send(result);
    } catch (err) {
        res.status(err.status).send(err.message);
    }
}

module.exports = {
    signupAdmin,
    loginAdmin,
    adminOtp,
    adminVerify,
    addCourse,
    getAllCourse
}