const { statusCode } = require('../Constant/constant');
const { signupService, loginService, changePasswordService, sendOtpService, verifyStudentService,  } = require('../Service/userService');

const signup = async (req, res) => {
  try {
    const result = await signupService(req.body);
    if (result.success) {
      res.status(result.status).send(result);
    } else {
      res.status(result.error.status).send(result);
    }
  } catch (err) {
    res.status(err.status).send(err.message);
  }
};

const login = async (req, res) => {
  try {
    console.log('PASSWORD',req.body.password);
    const result = await loginService(req.body);
    res.status(result.status).send(result);
  } catch (err) {
    res.status(err.status).send(err.message);
    }
}

const changePassword = async (req, res) => {
  try {
    const result = await changePasswordService(req);
    res.status(result.status).send(result);
  } catch (err) {
    res.status(err.status).send(err.message);
  }
}

const sendOtp = async (req, res) => {
  try {
    const result = await sendOtpService(req.body.email);
    res.status(statusCode['OK']).send(result);
  } catch (err) {
    res.status(err.status).send(err.message);
  }
}

const verifyStudent = async (req, res) => {
  try {
    const result = await verifyStudentService(req.body);
    res.status(result.status).send(result);
  } catch (err) {
    res.status(err.status).send(err.message);
  }
}

module.exports = {
  signup,
  login,
  changePassword,
  sendOtp,
  verifyStudent
};
