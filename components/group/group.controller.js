const groupService = require('./group.service');
const { cryptoService, groupUserRoleService, groupUserService, userService, mailService } = require('../service.init');
const { GROUP_USER_ROLE } = require('../group-user-role/group-user-role.constant');

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

const joinGroupByLink = async (req, res) => {
  const token = req.query.token.replaceAll(' ', '+');
  const decryptData = await cryptoService.decryptData(token);
  if (decryptData) {
    if (decryptData.expired < new Date().getTime()) {
      return res.status(400).json({ status: false, message: 'Expired link' });
    }
    const groupUserRole = await groupUserRoleService.findOneByName(GROUP_USER_ROLE.MEMBER);
    const data = await groupUserService.createGroupUser(req.user.id, +decryptData.groupId, groupUserRole.id);
    return res.status(200).json({ status: true, message: 'Successful', data: data.data });
  }
  return res.status(400).json({ status: false, message: 'Invalid invite link' });
};

const createInviteLink = async (req, res) => {
  const { groupId } = req.query;
  const checkGroup = await groupService.findOneById(groupId);
  if (!checkGroup) {
    return res.status(400).json({ status: false, message: 'Invalid group' });
  }
  let url = process.env.NODE_ENV === 'PRODUCTION' ? process.env.BE_URL : `http://localhost:${process.env.PORT}`;
  const encryptData = {
    groupId,
    expired: new Date().getTime() + 60 * 60 * 1000,
  };
  const token = await cryptoService.encryptData(encryptData);
  const data = {
    link: `${url}/group/join-by-link?token=${token}`,
  };
  return res.status(200).json({ status: true, message: 'Successful', data });
};

const inviteUserByEmail = async (req, res) => {
  const { email, groupId } = req.query;
  const receiver = await userService.findOneByEmail(email);
  if (!receiver) {
    return res.status(400).json({ status: false, message: 'Invalid email' });
  }
  const checkGroup = await groupService.findOneById(groupId);
  if (!checkGroup) {
    return res.status(400).json({ status: false, message: 'Invalid group' });
  }
  const checkUserGroup = await groupUserService.findOneByUserIdAndGroupId(receiver.id, groupId);
  if (checkUserGroup) {
    return res.status(400).json({ status: false, message: 'This user is in the group' });
  }
  const sender = await userService.findOneByEmail(req.user.email);
  const domain = process.env.NODE_ENV === 'PRODUCTION' ? process.env.REACT_URL_APP : `http://localhost:5566`;
  const encryptData = {
    email,
    groupId,
    expired: new Date().getTime() + 60 * 60 * 1000,
  };
  const token = await cryptoService.encryptData(encryptData);
  const data = {
    link: `${domain}/group/join-by-email?token=${token}`,
  };
  const content = mailService.inviteToGroup(sender.full_name, receiver.full_name, checkGroup.name, data.link);
  await mailService.sendEmail(email, 'Invite to group', content);
  return res.status(200).json({ status: true, message: 'Successful' });
};

const joinGroupByEmail = async (req, res) => {
  const token = req.query.token.replaceAll(' ', '+');
  const decryptData = await cryptoService.decryptData(token);
  if (decryptData) {
    console.log('decryptData', decryptData);
    if (decryptData.email !== req.user.email) {
      return res.status(400).json({ status: false, message: 'This link not belong to you' });
    }
    if (decryptData.expired < new Date().getTime()) {
      return res.status(400).json({ status: false, message: 'Expired link' });
    }
    const groupUserRole = await groupUserRoleService.findOneByName(GROUP_USER_ROLE.MEMBER);
    const data = await groupUserService.createGroupUser(req.user.id, +decryptData.groupId, groupUserRole.id);
    return res.status(200).json({ status: true, message: 'Successful', data: data.data });
  }
  return res.status(400).json({ status: false, message: 'Invalid invite link' });
};

module.exports = {
  getGroupsByUserId,
  getGroupsByOwnUserId,
  getGroupsByJoinedUserId,
  createGroup,
  inviteByEmail,
  checkOwnedUser,
  joinGroupByLink,
  createInviteLink,
  inviteUserByEmail,
  joinGroupByEmail,
};
