const schedule = require('node-schedule');
const fs = require('fs');
const { initializeApp } = require('firebase/app');
const { getStorage, ref, getDownloadURL, uploadBytesResumable} = require('firebase/storage');


const { bookModel } = require('../Schema/bookSchema');
const { statusCode } = require('../Constant/constant');
const { StudentModel } = require('../Schema/studentSchema');
const { asignedBookModel } = require('../Schema/asignedBookSchema');
const { firebaseConfig } = require('../config/config')
const { userRegistrationSchema, studentLoginSchema, changePasswordSchema, otpSchema, asignBookSchema } = require('../Validation/validation');
const { getHashPassword, comparePassword, generateToken, generateError, sendResponse, sendMail, generateFourDigitOtp, sendEmailFromService, giveCurrentDateTime } = require('../Utils/utils');
const { findOne, saveData, findOneAndUpdate, findByQuery, findAll, findID, updateById, populateQuery } = require('../Dao/dao');

initializeApp(firebaseConfig);
const storage = getStorage();
const  scheduledTask = async () =>  {
      try {
        const today = new Date().setHours(0, 0, 0, 0);
        const findQuery = { isDeleted: false, expireDate: { $lt: today } };
        const populate = [{ path: 'user', select: 'email' }, { path: 'book' }];
        const result = await populateQuery(asignedBookModel, findQuery, populate);
        result.forEach(async (element) => {
          const htmlTemplate = fs.readFileSync('Template/expireBook.html', 'utf-8');
          let formattedHtml = htmlTemplate.replace('{{name}}', element.book.name);
          formattedHtml = formattedHtml.replace('{{authorName}}', element.book.author);
          const sendEmailResult = await sendEmailFromService(element.user.email,formattedHtml,'Please submit the book')
        })
    } catch (error) {
        console.error('Error in scheduled task:', error);
    }
}

const job = schedule.scheduleJob('28 20 * * *', scheduledTask);


const signupService = async (req) => {
  try {
    const { email, registrationNumber } = req;
    const { error } = userRegistrationSchema.validate(req);
    if (error) {
      const err = new Error(error.message);
      err.status = statusCode.Unauthorized;
      throw err;
    }
    req.password = await getHashPassword(req.password);

    const query = { email, isDeleted: false };
    const studentFound = await findOne(StudentModel, query) || await findOne(StudentModel, { registrationNumber, isDeleted: false });
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
      throw await generateError('Password is not correct', statusCode['Bad Request'])
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
    const { password } = await findOne(StudentModel, { email });
    const { oldPassword, newPassword } = req.body

    if (error) {
      throw await generateError(error.message, statusCode['Bad Request'])
    }

    if (! await comparePassword(oldPassword, password)) {
      throw await generateError('Please give right old password', statusCode['Unauthorized']);
    }

    const hashPassword = await getHashPassword(newPassword);

    const changedData = await findOneAndUpdate(StudentModel, { email }, { password: hashPassword });

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
    await findOneAndUpdate(StudentModel, { email }, { otp });
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

    const studentData = await findOne(StudentModel, { email });

    if (otp == studentData.otp) {
      const result = await findOneAndUpdate(StudentModel, { email }, { isVerify: true });
      return await sendResponse('Student has been verify', result);
    }

    throw await generateError('Please give correct otp', statusCode['Unauthorized']);
  } catch (error) {
    throw await generateError(error.message, error.status);
  }
}

const getRecommendedBookService = async (req) => {
  try {
    const { course, branch, semester, year } = req;
    const findQuery = {
      'course.courseName': course,
      'course.branch': branch,
      'course.semester': semester,
      'course.year': year,
    };
    const bookData = await findByQuery(bookModel, findQuery);
    return await sendResponse('Book fetched successfully', bookData);
  } catch (err) {
    throw await generateError(err.message, err.status);
  }
}

const getAllBookService = async () => {
  try {
    const bookData = await findAll(bookModel);
    return await sendResponse('Book fetched successfully', bookData);
  } catch (err) {
    throw await generateError(err.message, err.status);
  }
}

const asignBookService = async (req) => {
  try {
    const { _id } = req.student;
    req.body.user = _id;
    const { book, user } = req.body;
    const { error } = asignBookSchema.validate(req.body);
    if (error) {
      throw await generateError(error.message, statusCode['Bad Request']);
    }
    const asignBookData = await findOne(asignedBookModel, { user, book, isDeleted: false });
    if (asignBookData) {
      throw await generateError('Book already asigned to student', statusCode['Already Reported']);
    }
    const bookData = await findID(bookModel, book);
    if (bookData.availableBook == 0) {
      throw await generateError('Book is not in stock', statusCode['Forbidden']);
    }
    await updateById(bookModel, book, { availableBook: (bookData.availableBook - 1) });
    const asignedBook = await saveData(asignedBookModel, req.body);
    return await sendResponse('Book has been asigned to student', asignedBook);
  } catch (err) {
    throw await generateError(err.message, err.status);
  }
}

const studentExpireBookService = async (req) => {
  try {
    const { _id } = req;
    const today = new Date().setHours(0,0,0,0);
    const findQuery = { user: _id, isDeleted: false, isVerify: true, expireDate: {$lt : today} };
    const populate = [{ path: 'user' }, { path: 'book' }];
    const result = await populateQuery(asignedBookModel, findQuery, populate);
    return await sendResponse('Expired book fetch successfully', result);
  } catch (err) {
    throw await generateError(err.message, err.status);
  }
}

const uploadFileService = async (req) => {
  try {
    const dateTime = giveCurrentDateTime();
    const storageRef = ref(storage, `files/${req.file.originalname + " " + dateTime}`);
    const metaData = {
      contentType : req.file.mimetype,
    }

    const snapShot = await uploadBytesResumable(storageRef, req.file.buffer, metaData);
    const downloadURL = await getDownloadURL(snapShot.ref);

    return await sendResponse('File uploaded', downloadURL);
  } catch (err) {
    throw await generateError(err.message, err.status);
  }
}

module.exports = {
  signupService,
  loginService,
  changePasswordService,
  sendOtpService,
  verifyStudentService,
  getRecommendedBookService,
  getAllBookService,
  asignBookService,
  studentExpireBookService,
  uploadFileService,
};
