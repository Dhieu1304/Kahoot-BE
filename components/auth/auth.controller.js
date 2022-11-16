const authService = require('./auth.service');
const userService = require('../user/user.service');
const { roleService, userStatusService } = require('../service.init');
const { USER_STATUS } = require('../user-status/user-status.constant');
const { v4: uuidv4 } = require('uuid');

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
  const user = {
    email,
    password: hashPassword,
    full_name: name,
    role_id: roleId.id,
    status_id: statusId.id,
    uid: uuidv4(),
  };
  const data = await userService.createUser(user);
  const status = data.status ? 200 : 400 || 500;
  return res.status(status).json(data);
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
  const token = await authService.generateToken(existsUser.email, existsUser.role);
  await userService.updateUserByEmail(email, { refresh_token: token.refreshToken });
  return res.status(200).json({ status: true, data: token });
};
