const userService = require('./user.service');

module.exports.info = async (req, res) => {
  const { email } = req.user;
  const user = await userService.getInfoByEmail(email);
  if (user) {
    return res.status(200).json({ status: true, message: 'Successful', data: user });
  }
  return res.status(400).json({ status: false, message: 'Do not find user in system' });
};

module.exports.updateInfo = async (req, res) => {
  const { avatar, full_name } = req.body;
  const updateBody = {};
  if (avatar) updateBody.avatar = avatar;
  if (full_name) updateBody.full_name = full_name;
  const user = await userService.updateUserByEmail(req.user.email, updateBody);
  if (user) {
    return res.status(200).json({ status: true, message: 'Successful' });
  }
  return res.status(400).json({ status: false, message: 'Do not find user in system' });
};

module.exports.getUsersByGroupId = async (req, res) => {
  const group_id_str = req.params.group_id;
  const group_id = parseInt(group_id_str) || -1;
  const users = await userService.getUsersByGroupId({ group_id });
  return res.status(200).json({ status: true, data: users });
};
