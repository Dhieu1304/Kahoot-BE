const bcrypt = require('bcryptjs');
const userService = require('../user/user.service');
const jwt = require('jsonwebtoken');
const { randomString } = require('../utils/random-string');
const { mailService, verifyService, cryptoService } = require('../service.init');
const { VERIFY_TYPE } = require('../verify-type/verify-type.constant');
const { getAuth } = require('firebase-admin/auth');

module.exports.register = async (user) => {
  return await userService.createUser(user);
};

module.exports.hashPassword = async (password) => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (e) {
    console.error(e.message);
    return false;
  }
};

module.exports.comparePassword = async (password, hashPassword) => {
  try {
    return await bcrypt.compare(password, hashPassword);
  } catch (e) {
    console.error(e.message);
    return false;
  }
};

module.exports.generateToken = async (payload, expTime) => {
  try {
    return jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: expTime, //process.env.TIME_EXPIRE_ACCESS,
    });
  } catch (e) {
    console.error(e.message);
    return { status: false, message: 'Error generate token' };
  }
};

module.exports.verifyToken = async (token) => {
  try {
    return jwt.verify(token, process.env.SECRET_KEY);
  } catch (e) {
    console.error(e.message);
    return false;
  }
};

module.exports.sendMaleVerify = async (userId, email, name) => {
  try {
    const code = randomString(6);
    const token = cryptoService.encryptData({
      id: userId,
      email: email,
      code: code,
      type: VERIFY_TYPE.VERIFY_MAIL,
      date: new Date().getTime(),
    });
    const sendMail = await mailService.sendVerifyEmail(email, name, token);
    if (sendMail) {
      await verifyService.createNewVerify(userId, VERIFY_TYPE.VERIFY_MAIL, code);
    }
  } catch (e) {
    console.error(e.message);
  }
};

module.exports.verifyIdTokenFirebase = async (idToken) => {
  try {
    const data = await getAuth().verifyIdToken(idToken);
    console.log(data);
    return { status: true, data };
  } catch (e) {
    console.error(e.message);
    return { status: false, message: e.message };
  }
};
