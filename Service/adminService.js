const { statusCode } = require("../Constant/constant");
const { findOne, saveData, findOneAndUpdate, findAll, updateById, findByQuery } = require("../Dao/dao");
const { adminModel } = require("../Schema/adminSchema");
const { asignedBookModel } = require("../Schema/asignedBookSchema");
const { bookModel } = require("../Schema/bookSchema");
const { courseModel } = require("../Schema/courseSchema");
const { StudentModel } = require("../Schema/studentSchema");
const { generateError, comparePassword, generateToken, sendResponse, getHashPassword, sendMail, generateFourDigitOtp } = require("../Utils/utils");
const { adminRegistrationSchema, studentLoginSchema, courseSchema, otpSchema, bookSchema, asignBookSchema, verifyAsignBookSchema } = require("../Validation/validation")

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
        const sem = req.semester;
        req.semester = [];
        for(let i = 0; i<sem; i++){
            req.semester.push(i + 1);
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

const addBookService = async (req) => {
    try {
        const { error } =  bookSchema.validate(req);
        if (error) {
            throw await generateError(error.message, statusCode['Bad Request']);
        }
        req.availableBook = req.totalBook;
        const bookData = await saveData(bookModel, req);
        return await sendResponse('Book has been saved', bookData);
    } catch (err) {
        throw await generateError(err.message, err.status);
    }
}

const updateBookService = async (req) => {
    try {
        const { _id, totalBook} = req;
        if (!_id) {
            throw await generateError("Please provide book id", statusCode['Bad Request']);
        }
        const bookData = await findOne(bookModel, {_id});
        if (totalBook) {
            req.availableBook = bookData.availableBook + (totalBook - bookData.totalBook);
        }
        const updateData = await updateById(bookModel, _id, req);
        return await sendResponse('Book update successfully',updateData);
    } catch (err) {
        throw await generateError(err.message, err.status);
    }
}

const sendOtpToUserForVerifyAsignBookService = async (req) => {
    try {
        const { email, bookId } = req;
        if (!email) {
            throw await generateError("Please provide student email", statusCode['Bad Request']);
        }
        const studentData = await findOne(StudentModel, { email });
        if (!studentData) {
            throw await generateError("Please provide the correct email", statusCode['Bad Request']);
        }
        const _id = studentData._id;
        const otp = await generateFourDigitOtp();
        const sendOtp = await sendMail(email, otp);
        await findOneAndUpdate(asignedBookModel, {_id: bookId}, {otp});
        sendOtp.studentId = _id
        return sendOtp;
    } catch (err) {
        throw await generateError(err.message, err.status);
    }
}

const verifyAsignedBookService = async (req) => {
    try {
        const { otp, bookId } = req;
        const { error } = verifyAsignBookSchema.validate(req);
        const newDate = new Date().getTime();
        if (error) {
            throw await generateError(error.message, statusCode['Bad Request']);
        }
        const asignBookData = await findOne(asignedBookModel, {_id: bookId});
        const expireDate = newDate + (asignBookData.expireDate - asignBookData.asignedDate);
        if (otp != asignBookData.otp) {
            throw await generateError('Please provide correct otp', statusCode['Not Found']);
        }
        const asignedBookUpdatedData = await findOneAndUpdate(asignedBookModel, {_id: bookId}, {isVerify: true, asignedDate: newDate, expireDate: expireDate});
        return await sendResponse('Asigned book has been verified', asignedBookUpdatedData);
    } catch (err) {
        throw await generateError(err.message, err.status);
    }
}

module.exports = {
    signupAdminService,
    adminLoginService,
    adminOtpService,
    adminVerifyService,
    addCourseService,
    getAllCourseService,
    addBookService,
    updateBookService,
    sendOtpToUserForVerifyAsignBookService,
    verifyAsignedBookService,
}