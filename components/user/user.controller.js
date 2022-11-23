const userService = require('./user.service');

module.exports.info = async (req, res) => {
  const { email } = req.user;
  const user = await userService.getInfoByEmail(email);
  return res.status(200).json({ status: true, data: user });
};
