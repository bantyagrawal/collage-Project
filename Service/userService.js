const { statusCode } = require('../Constant/constant');
const { StudentModel } = require('../Schema/studentSchema');
const { userRegistrationSchema, studentLoginSchema, changePasswordSchema, otpSchema } = require('../Validation/validation');
const { getHashPassword, comparePassword, generateToken, generateError, sendResponse, sendMail, generateFourDigitOtp } = require('../Utils/utils');
const { findOne, saveData, findOneAndUpdate } = require('../Dao/dao');

const signupService = async (req) => {
  try {
    const { email , registrationNumber } = req;
    const { error } = userRegistrationSchema.validate(req);
    if (error) {
      const err = new Error(error.message);
      err.status = statusCode.Unauthorized;
      throw err;
    }
    req.password = await getHashPassword(req.password);

    const query = { email, isDeleted: false };
    const studentFound = await findOne(StudentModel, query) || await findOne(StudentModel, {registrationNumber, isDeleted: false});
    if (studentFound) {
      const error = new Error('Student already exist');
      error.status = statusCode['Already Reported'];
      throw error;
    }
    const studentdata = await saveData(StudentModel, req);
    return await sendResponse('Student has been created', studentdata);
  } catch (error) {
    throw await generateError(error.message, error.status);
  }
};

const loginService = async (req) => {

  try {
    const { email, password } = req;
    const { error } = studentLoginSchema.validate(req);
    if (error) {
      const err = new Error(error.message);
      err.status = statusCode.Unauthorized;
      throw err;
    }

    const studentData = await StudentModel.findOne({ email });
    if (!studentData) {
      const err = new Error('There is no record found from that given data. Please give valid detail');
      err.status = statusCode['Not Found'];
      throw err;
    }

    if (!studentData.isVerify) {
      throw await generateError('Please verify first', statusCode['Unauthorized']);
    }

    const isPasswordCorrect = await comparePassword(password, studentData.password);

    if (!isPasswordCorrect) {
      const err = new Error('Password is not correct');
      err.status = statusCode['Unauthorized'];
      throw err;
    }

    const token = await generateToken(studentData, process.env.USER_SECRATE);

    return await sendResponse('User has been loged in', token);
  } catch (error) {
    throw await generateError(error.message, error.status);
  }
}

const changePasswordService = async (req) => {
  try {
    const { error } = changePasswordSchema.validate(req.body);
    const { email } = req.student;
    const { password } = await findOne(StudentModel,{email});
    const { oldPassword, newPassword } = req.body

    if (error) {
      throw await generateError(error.message, statusCode['Bad Request'])
    }

    if (! await comparePassword(oldPassword, password)) {
      throw await generateError('Please give right old password', statusCode['Unauthorized']);
    }

    const hashPassword = await getHashPassword(newPassword);

    const changedData = await findOneAndUpdate(StudentModel,{email},{password: hashPassword});

    return await sendResponse('Password has been changed', changedData);
  } catch (err) {
    throw await generateError(error.message, error.status);
  }
}

const sendOtpService = async (email) => {
  try {

    if (!email) {
      throw await generateError('Please provide require info', statusCode['Bad Request']);
    }

    const otp = await generateFourDigitOtp();
    await findOneAndUpdate(StudentModel,{email},{otp});
    return await sendMail(email, otp);

  } catch (err) {
    throw await generateError(error.message, error.status);
  }
}

const verifyStudentService = async (req) => {
  try {
    const { error } = otpSchema.validate(req);
    const { email, otp } = req;

    if (error) {
      throw await generateError(error.message, statusCode['Bad Request']);
    }

    const studentData = await findOne(StudentModel, {email});

    if (otp == studentData.otp) {
      const result = await findOneAndUpdate(StudentModel,{email},{isVerify: true});
      return await sendResponse('Student has been verify',result);
    }

    throw await generateError('Please give correct otp', statusCode['Unauthorized']);
  } catch (error) {
    throw await generateError(error.message, error.status);
  }
}

module.exports = {
  signupService,
  loginService,
  changePasswordService,
  sendOtpService,
  verifyStudentService
};
