const authService = require('./auth.service');
const userService = require('../user/user.service');
const { roleService, userStatusService, cryptoService, verifyService, mailService } = require('../service.init');
const { USER_STATUS } = require('../user-status/user-status.constant');
const { v4: uuidv4 } = require('uuid');
const { ROLE } = require('../role/role.constant');

module.exports.register = async (req, res) => {
  const { email, password, name, avatar } = req.body;
  const exitsUser = await userService.findOneByEmail(email);
  if (exitsUser) {
    return res.status(400).json({
      status: false,
      message: `${email} already used, please try another email`,
    });
  }
  const roleId = await roleService.findOneRoleByName(ROLE.USER);
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
    avatar,
  };
  const data = await userService.createUser(user);
  const status = data.status ? 200 : 400 || 500;
  res.status(status).json(data);
  if (data.status) {
    await authService.sendMailVerify(data.data.id, email, name);
  }
};

module.exports.googleAuth = async (req, res) => {
  const { idToken } = req.body;
  const verifyToken = await authService.verifyIdTokenFirebase(idToken);
  if (verifyToken && verifyToken.status) {
    const { data } = verifyToken;
    let user = await userService.findOneByEmail(data.email);
    if (!user) {
      const roleId = await roleService.findOneRoleByName(ROLE.USER);
      let statusId;
      if (data.email_verified) {
        statusId = await userStatusService.findOneUserStatusByName(USER_STATUS.ACTIVE);
      } else {
        statusId = await userStatusService.findOneUserStatusByName(USER_STATUS.IN_ACTIVE);
      }
      const uid = uuidv4();
      const newUser = {
        email: data.email,
        password: 'firebase-google-sign-in',
        full_name: data.name,
        role_id: roleId.id,
        status_id: statusId.id,
        uid,
        avatar: data.picture,
      };
      user = await userService.createUser(newUser);
    }
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role_id,
    };
    const accessToken = await authService.generateToken(payload, +process.env.TIME_EXPIRE_ACCESS);
    const refreshToken = await authService.generateToken(payload, process.env.TIME_EXPIRE_REFRESH);
    await userService.updateUserByEmail(data.email, { refresh_token: refreshToken });
    return res.status(200).json({ status: true, data: { accessToken, refreshToken } });
  }
  return res.status(400).json(verifyToken);
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
  const payload = {
    id: existsUser.id,
    email: existsUser.email,
    role: existsUser.role.id,
  };
  const accessToken = await authService.generateToken(payload, +process.env.TIME_EXPIRE_ACCESS);
  const refreshToken = await authService.generateToken(payload, process.env.TIME_EXPIRE_REFRESH);
  await userService.updateUserByEmail(email, { refresh_token: refreshToken });
  return res.status(200).json({ status: true, data: { accessToken, refreshToken } });
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
    const verifyData = await verifyService.findOneVerifyByUserIdAndType(data.id, data.type);
    if (data.code === verifyData.code) {
      const statusId = await userStatusService.findOneUserStatusByName(USER_STATUS.ACTIVE);
      const updateUser = await userService.updateUserByEmail(data.email, { status_id: statusId.id });
      return res.status(200).json({ status: true, message: 'Successful' });
    }
    return res.status(400).json({ status: false, message: 'Invalid Code' });
  } catch (e) {
    console.error(e.message);
  }
};

module.exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  const user = await userService.findOneByRefreshToken(refreshToken);
  const decoded = await authService.verifyToken(refreshToken);
  if (user && decoded) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role_id,
    };
    const token = await authService.generateToken(payload, +process.env.TIME_EXPIRE_ACCESS);
    return res.status(200).json({ status: true, data: { accessToken: token } });
  }
  return res.status(400).json({ status: false, message: 'BAD_REQUEST' });
};
