const models = require('../models');
const { groupUserService } = require('../service.init');

// user_id is Integer
// role_id is an integer or an array of integer
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
      raw: raw,
      include: [
        {
          model: models.group_user,
          as: 'group_users',
          where: group_userWhereOption,

          include: [
            {
              model: models.user,
              as: 'user',
            },
            {
              model: models.group_user_role,
              as: 'group_user_role',
            },
          ],
        },
      ],
    };

    return await models.group.findAll(options);
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

    const groupUser =
      group_id && user_id && (await groupUserService.createGroupUser({ user_id, group_id, group_user_role_id: 1 }));

    return { status: true, data, message: 'Create Successful' };
  } catch (e) {
    console.error(e.message);
    return { status: false, message: e.message };
  }
};

module.exports = {
  getGroupsByUserIds,
  createGroup,
};
