const { statusCode } = require('../Constant/constant');
const { signupService, loginService, changePasswordService, sendOtpService, verifyStudentService, getRecommendedBookService, getAllBookService, asignBookService, studentExpireBookService, uploadFileService} = require('../Service/userService');
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

const getRecommendedBook = async (req, res) => {
  try {
    const result = await getRecommendedBookService(req.student);
    res.status(result.status).send(result);
  } catch (err) {
    res.status(err.status).send(err.message);
  }
}

const getAllBooks = async (req, res) => {
  try {
    const result = await getAllBookService();
    res.status(result.status).send(result);
  } catch (err) {
    res.status(err.status).send(err.message);
  }
}

const asignBook = async (req, res) => {
  try {
    const result = await asignBookService(req);
    res.status(result.status).send(result);
  } catch (err) {
    res.status(err.status).send(err.message);
  }
}

const studentExpireBook = async (req, res) => {
  try {
    const result = await studentExpireBookService(req.student);
    res.status(result.status).send(result);
  } catch (err) {
    res.status(err.status).send(err.message);
  }
}

const uploadFile = async (req, res) => {
  try {
    const result = await uploadFileService(req);
    res.status(result.status).send(result);
  } catch (err) {
    res.status(err.status).send(err.message);
  }
}

const getStudent = async (req, res) => {
  try {
    res.status(statusCode.OK).send(req.student);
  } catch (err) {
    res.status(err.status).send(err.message);
  }
}
module.exports = {
  signup,
  login,
  changePassword,
  sendOtp,
  verifyStudent,
  getRecommendedBook,
  getAllBooks,
  asignBook,
  studentExpireBook,
  uploadFile,
  getStudent
};
