const userService = require('./user.service');

module.exports.info = async (req, res) => {
  const { email } = req.user;
  const user = await userService.getInfoByEmail(email);
  if (user) {
    return res.status(200).json({ status: true, message: 'Successful', data: user });
  }
  return res.status(400).json({ status: false, message: 'Do not find user in system' });
};

module.exports.getUsersByGroupId = async (req, res) => {
  const group_id_str = req.params.group_id;
  const group_id = parseInt(group_id_str) || -1;
  const users = await userService.getUsersByGroupId({ group_id });
  return res.status(200).json({ status: true, data: users });
};
