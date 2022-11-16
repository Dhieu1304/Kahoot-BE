const bcrypt = require('bcryptjs');
const userService = require('../user/user.service');
const jwt = require('jsonwebtoken');
const { randomString } = require('../utils/random-string');
const { mailService, verifyService, cryptoService } = require('../service.init');
const { VERIFY_TYPE } = require('../verify-type/verify-type.constant');

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

module.exports.generateToken = async (id, email, role) => {
  try {
    const accessToken = jwt.sign({ id, email, role }, process.env.SECRET_KEY, {
      expiresIn: process.env.TIME_EXPIRE_ACCESS,
    });
    const refreshToken = jwt.sign({ id, email, role }, process.env.SECRET_KEY, {
      expiresIn: process.env.TIME_EXPIRE_REFRESH,
    });
    return { accessToken, refreshToken };
  } catch (e) {
    console.log(e.message);
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

module.exports.sendMaleVerify = async (userId, email, name, role) => {
  try {
    const code = randomString(6);
    const token = cryptoService.encryptData({
      id: userId,
      email: email,
      code: code,
      type: VERIFY_TYPE.VERIFY_MAIL,
      date: new Date().getTime(),
    });
    const sendMail = await mailService.sendVerifyEmail(email, name, role, token);
    if (sendMail) {
      await verifyService.createNewVerify(userId, VERIFY_TYPE.VERIFY_MAIL, code);
    }
  } catch (e) {
    console.error(e.message);
  }
};
