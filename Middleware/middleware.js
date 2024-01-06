const { statusCode } = require("../Constant/constant");
const { generateError, verifyToken } = require("../Utils/utils");

const userVarification = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
         throw await generateError('Please login', statusCode['Unauthorized']);   
        }
        const token = req.headers.authorization.split(' ')[1];
        req.student = await verifyToken(token,process.env.USER_SECRATE);
        next();    
    } catch (err) {
        res.status(err.status).send(err)
    }
}

const adminVerification = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            throw await generateError('Please login first', statusCode['Unauthorized']);
        }
        const token = req.headers.authorization.split(' ')[1];
        req.admin = await verifyToken(token, process.env.ADMIN_SECRATE);
        next();
    } catch (err) {
        res.status(err.status).send(err);
    }
}
module.exports = {
    userVarification,
    adminVerification,
}