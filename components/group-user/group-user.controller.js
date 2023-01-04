const { groupUserService } = require('../service.init');

const changeRoleUser = async (req, res) => {
  const { userId, groupId, roleId } = req.body;
  if (roleId === 1) {
    return res.status(400).json({ status: false, message: 'Only change to co-owner or member' });
  }
  const checkAdminInGroup = await groupUserService.findOneByUserIdAndGroupId(req.user.id, groupId);
  if (!checkAdminInGroup || checkAdminInGroup?.group_user_role_id !== 1) {
    return res.status(400).json({ status: false, message: 'You do not have permission' });
  }
  const checkUserInGroup = await groupUserService.findOneByUserIdAndGroupId(userId, groupId);
  if (!checkUserInGroup) {
    return res.status(400).json({ status: false, message: 'User is not in group' });
  }
  const updateUserRole = await groupUserService.updateUserRoleInGroup(userId, groupId, roleId);
  if (updateUserRole) {
    return res.status(200).json({ status: true, message: 'Update successful' });
  }
  return res.status(400).json({ status: false, message: 'Error' });
};

const deleteMemberGroup = async (req, res) => {
  const { userId, groupId } = req.body;
  const checkAdminInGroup = await groupUserService.findOneByUserIdAndGroupId(req.user.id, groupId);
  if (!checkAdminInGroup || checkAdminInGroup?.group_user_role_id !== 1) {
    return res.status(400).json({ status: false, message: 'You do not have permission' });
  }
  const deleteUserGroup = await groupUserService.deleteUserGroup(userId, groupId);
  if (deleteUserGroup) {
    return res.status(200).json({ status: true, message: 'Successful' });
  }
  return res.status(400).json({ status: false, message: 'Error' });
};

module.exports = {
  changeRoleUser,
  deleteMemberGroup,
};
