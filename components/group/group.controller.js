const groupService = require('./group.service');

const getGroupsByUserId = async (req, res) => {
  const user_id_str = req.params.user_id;
  const user_id = parseInt(user_id_str) || -1;
  const groups = await groupService.getGroupsByUserIds({ user_id });
  return res.status(200).json({ status: true, data: groups });
};

const getGroupsByOwnUserId = async (req, res) => {
  const user_id_str = req.params.user_id;
  const user_id = parseInt(user_id_str) || -1;
  const groups = await groupService.getGroupsByUserIds({ user_id, role_id: 1 });
  return res.status(200).json({ status: true, data: groups });
};

const getGroupsByJoinedUserId = async (req, res) => {
  const user_id_str = req.params.user_id;
  const user_id = parseInt(user_id_str) || -1;
  const groups = await groupService.getGroupsByUserIds({ user_id, role_id: [2, 3] });
  return res.status(200).json({ status: true, data: groups });
};

const createGroup = async (req, res) => {
  const {
    name,
    member_can_share_content,
    member_can_share_assign_to_group,
    member_can_invite_new_people,
    member_can_see_other,
    user_id,
  } = req.body;

  const group = await groupService.createGroup({
    name,
    member_can_share_content,
    member_can_share_assign_to_group,
    member_can_invite_new_people,
    member_can_see_other,
    user_id,
  });

  return res.status(200).json({ status: true, data: group });
};

const inviteByEmail = async (req, res) => {
  const { id, email } = req.body;

  const group = await groupService.inviteByEmail({
    id,
    email,
  });

  return res.status(200).json({ status: true, data: group });
};

const checkOwnedUser = async (req, res) => {
  const { group_id, user_id } = req.query;

  const result = await groupService.checkOwnedUser({
    group_id,
    user_id,
  });

  return res.status(200).json({ status: true, data: result });
};

module.exports = {
  getGroupsByUserId,
  getGroupsByOwnUserId,
  getGroupsByJoinedUserId,
  createGroup,
  inviteByEmail,
  checkOwnedUser,
};
