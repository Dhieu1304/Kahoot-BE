const groupService = require('./group.service');

module.exports.getGroupByUserId = async (req, res) => {
  const id = req.params.id;
  const group = await groupService.getGroupByUserId(id);
  return res.status(200).json({ status: true, data: group });
};
