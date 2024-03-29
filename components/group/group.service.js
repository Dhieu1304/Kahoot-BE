const sequelize = require('sequelize');
const models = require('../models');
const { groupUserService } = require('../service.init');

const getGroupById = async ({ id, raw = false }) => {
  try {
    const group = await models.group.findOne({
      where: {
        id,
      },
      raw: raw,
    });

    return group;
  } catch (e) {
    console.error(e.message);
    return { status: false, message: e.message };
  }
};

const renameGroupById = async ({ id, name, raw = false }) => {
  try {
    const group = await models.group.findOne({
      where: {
        id,
      },
      raw: raw,
    });

    const result = await group.update({
      name,
    });
    await group.save();

    return group;
  } catch (e) {
    console.error(e.message);
    return { status: false, message: e.message };
  }
};

const getGroupsByUserIds = async ({ user_id, role_id, raw = false }) => {
  try {
    user_id = parseInt(user_id) || -1;

    const group_userWhereOption = role_id
      ? {
          user_id: user_id,
          group_user_role_id: role_id,
        }
      : {
          user_id: user_id,
        };

    const options = {
      include: [
        {
          model: models.group_user,
          as: 'group_users',
          where: group_userWhereOption,
          attributes: [],
        },
      ],
      attributes: ['id'],
    };

    const groups = await models.group.findAll(options);

    return await models.group.findAll({
      where: {
        id: groups.map((group) => group.id),
      },
      include: [
        {
          model: models.group_user,
          as: 'group_users',
          include: [
            {
              model: models.user,
              as: 'user',
              attributes: { exclude: ['password', 'uid', 'refresh_token'] },
            },
            {
              model: models.group_user_role,
              as: 'group_user_role',
            },
          ],
        },
      ],
    });
  } catch (e) {
    console.error(e.message);
    return { status: false, message: e.message };
  }
};

const createGroup = async ({
  name,
  member_can_share_content,
  member_can_share_assign_to_group,
  member_can_invite_new_people,
  member_can_see_other,
  user_id,
}) => {
  try {
    const group = {
      name,
      member_can_share_content,
      member_can_share_assign_to_group,
      member_can_invite_new_people,
      member_can_see_other,
    };

    const data = await models.group.create(group);
    let group_id = data?.id;

    user_id = parseInt(user_id);

    const groupUser = group_id && user_id && (await groupUserService.createGroupUser(user_id, group_id, 1));

    return { status: true, data, message: 'Create Successful' };
  } catch (e) {
    console.error(e.message);
    return { status: false, message: e.message };
  }
};

const inviteByEmail = async ({ id, email }) => {
  try {
    //
    return { status: true, data, message: 'Invite Successful' };
  } catch (e) {
    console.error(e.message);
    return { status: false, message: e.message };
  }
};

const checkOwnedUser = async ({ group_id, user_id }) => {
  user_id = parseInt(user_id);
  group_id = parseInt(group_id);
  try {
    const result = await models.group_user.findAll({
      where: {
        group_id,
        user_id,
        group_user_role_id: 1,
      },
    });

    if (result.length > 0) return true;
    else return false;
  } catch (e) {
    console.error(e.message);
    return { status: false, message: e.message };
  }
};

const findOneById = async (groupId) => {
  try {
    return await models.group.findOne({ where: { id: groupId } });
  } catch (e) {
    console.error(e.message);
  }
};

const sendMailInvite = async (groupId) => {
  try {
    return await models.group.findOne({ where: { id: groupId } });
  } catch (e) {
    console.error(e.message);
  }
};

const deleteGroup = async (id) => {
  try {
    return await models.group.destroy({ where: { id } });
  } catch (e) {
    console.error(e.message);
  }
};

module.exports = {
  getGroupById,
  renameGroupById,
  getGroupsByUserIds,
  createGroup,
  inviteByEmail,
  checkOwnedUser,
  findOneById,
  sendMailInvite,
  deleteGroup,
};
