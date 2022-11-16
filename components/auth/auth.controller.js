const authService = require('./auth.service');
const userService = require('../user/user.service');
const { roleService, userStatusService, cryptoService, verifyService, mailService } = require('../service.init');
const { USER_STATUS } = require('../user-status/user-status.constant');
const { v4: uuidv4 } = require('uuid');
const { VERIFY_TYPE } = require('../verify-type/verify-type.constant');

module.exports.register = async (req, res) => {
  const { email, password, name, role } = req.body;
  const exitsUser = await userService.findOneByEmail(email);
  if (exitsUser) {
    return res.status(400).json({
      status: false,
      message: `${email} already used, please try another email`,
    });
  }
  const roleId = await roleService.findOneRoleByName(role);
  const statusId = await userStatusService.findOneUserStatusByName(USER_STATUS.IN_ACTIVE);
  const hashPassword = await authService.hashPassword(password);
  const uid = uuidv4();
  const user = {
    email,
    password: hashPassword,
    full_name: name,
    role_id: roleId.id,
    status_id: statusId.id,
    uid,
  };
  const data = await userService.createUser(user);
  const status = data.status ? 200 : 400 || 500;
  res.status(status).json(data);
  if (data.status) {
    await authService.sendMaleVerify(data.data.id, email, name, role);
  }
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  const existsUser = await userService.findOneDetailByEmail(email);
  if (!existsUser) {
    return res.status(400).json({ status: false, message: `No account with email: ${email}` });
  }
  const isMatchPassword = await authService.comparePassword(password, existsUser.password);
  if (!isMatchPassword) {
    return res.status(400).json({ status: false, message: `Wrong password` });
  }
  if (existsUser.status.name === USER_STATUS.IN_ACTIVE) {
    return res.status(400).json({ status: false, message: `Please check mail and verify account` });
  } else if (existsUser.status.name === USER_STATUS.BLOCK) {
    return res.status(400).json({ status: false, message: `Your account has been blocked` });
  }
  const token = await authService.generateToken(existsUser.id, existsUser.email, existsUser.role);
  await userService.updateUserByEmail(email, { refresh_token: token.refreshToken });
  return res.status(200).json({ status: true, data: token });
};

module.exports.reSendVerifyEmail = async (req, res) => {
  const user = await userService.findOneByEmail(req.user.email);
  await authService.sendMaleVerify(user.id, user.email, user.full_name, user.role);
  return res.status(200).json({ status: true, message: 'Successful' });
};

module.exports.verifyEmail = async (req, res) => {
  try {
    const token = req.query.token.replaceAll(' ', '+');
    const data = cryptoService.decryptData(token);
    console.log(data);
    const verifyData = await verifyService.findOneVerifyByUserIdAndType(data.id, data.type);
    if (data.code === verifyData.code) {
      const statusId = await userStatusService.findOneUserStatusByName(USER_STATUS.ACTIVE);
      const data1 = await userService.updateUserByEmail(data.email, { status_id: statusId.id });
      console.log(data1);
      return res.status(200).json({ status: true, message: 'Successful' });
    }
    return res.status(400).json({ status: false, message: 'Invalid Code' });
  } catch (e) {
    console.error(e.message);
  }
};
