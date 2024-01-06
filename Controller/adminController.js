const { signupAdminService, adminLoginService, adminOtpService, addCourseService } = require("../Service/adminService")

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
        const result = await adminOtpService();
        res.status(result.status).send(result);
    } catch (err) {
        res.status(err.status).send(err.message);
    }
}

const adminVerify = async (req, res) => {
    try {
        const result = await adminVerify(req.body);
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

module.exports = {
    signupAdmin,
    loginAdmin,
    adminOtp,
    adminVerify,
    addCourse,
}