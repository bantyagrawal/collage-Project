const { statusCode } = require("../Constant/constant");
const { findOne, saveData, findOneAndUpdate, findAll } = require("../Dao/dao");
const { adminModel } = require("../Schema/adminSchema");
const { courseModel } = require("../Schema/courseSchema");
const { generateError, comparePassword, generateToken, sendResponse, getHashPassword, sendMail, generateFourDigitOtp } = require("../Utils/utils");
const { adminRegistrationSchema, studentLoginSchema, courseSchema, otpSchema } = require("../Validation/validation")

const signupAdminService = async (req) => {
    try {

        const { email } = req;
        const { error } = adminRegistrationSchema.validate(req);

        if ( error ) {
            throw await generateError(error.message, statusCode['Unauthorized']);
        }
        const adminFound = await findOne(adminModel,{email});
        if (adminFound) {
            throw await generateError('Admin already have an account', statusCode['Already Reported']);
        }
        req.password = await getHashPassword(req.password);
        const adminData = await saveData(adminModel, req);
        return await sendResponse('Admin has been created', adminData);

    } catch (err) {
        throw await generateError(err.message, err.status)
    }
}

const adminLoginService = async (req) => {
    try {

        const { email, password } = req;
        const { error } = studentLoginSchema.validate(req);
        
        if (error) {
            throw await generateError(error.message, statusCode['Unauthorized']);
        }
        const adminData = await findOne(adminModel, {email});
        if (!adminData) {
            throw await generateError('Admin not found', statusCode['Not Found']);
        }
        if (!await comparePassword(password, adminData.password)) {
            throw await generateError('Please give correct password', statusCode['Unauthorized']);
        }
        if (!adminData.isVerified) {
            throw await generateError('Please verify account', statusCode['Unauthorized']);
        }
        const token = await generateToken(adminData, process.env.ADMIN_SECRATE);
        return await sendResponse('Login successfully', {token});
    } catch (err) {
        throw await generateError(err.message, err.status);
    }

}

const adminOtpService = async (req) => {
    try {
        const { email } = req;

        if (!email) {
            throw await generateError('Please provide email ', statusCode['Unauthorized']);
        }
        const otp = await generateFourDigitOtp();
        await findOneAndUpdate(adminModel,{email},{otp});
        return await sendMail(process.env.ADMIN_MAIL, otp);
    } catch (err) {
        throw await generateError(err.message, err.status);
    }
}

const adminVerifyService = async (req) => {
    try {

        const { email, otp} = req;
        const { error } = otpSchema.validate(req);

        if (error) {
            throw await generateError(error.message, statusCode['Unauthorized']);
        }
        const adminData = await findOne(adminModel,{email});
        if (adminData.otp == otp) {
            const data = await findOneAndUpdate(adminModel,{email},{isVerified: true});
            return await sendResponse('Admin has been verified successfully',data);
        }
        throw await generateError('Please provide correct otp');
    } catch (err) {
        throw await generateError(err.message, err.status);
    }
}

const addCourseService = async (req) => {
    try {
        const { name } = req;
        const { error } = courseSchema.validate(req);

        if (error) {
            throw await generateError(error.message, statusCode['Unauthorized']);
        }
        const courseFound = await findOne(courseModel,{name});
        if (courseFound) {
            throw await generateError('Course already exist',statusCode['Already Reported']);
        }

        const courseData = await saveData(courseModel, req);
        return await sendResponse('course added successfully', courseData);
    } catch (err) {
        throw await generateError(err.message, err.status);
    }
}

const getAllCourseService = async () => {
    try {
        const courseData = await findAll(courseModel);
        return await sendResponse('Course fetch successfully', courseData);
    } catch (err) {

    }
}

module.exports = {
    signupAdminService,
    adminLoginService,
    adminOtpService,
    adminVerifyService,
    addCourseService,
    getAllCourseService,
}