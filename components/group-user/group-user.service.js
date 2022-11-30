const models = require('../models');

const createGroupUser = async (user_id, group_id, group_user_role_id) => {
  try {
    const groupUser = {
      user_id,
      group_id,
      group_user_role_id,
    };

    const data = await models.group_user.create(groupUser);
    return { status: true, data, message: 'Create Successful' };
  } catch (e) {
    console.error(e.message);
    return { status: false, message: e.message };
  }
};

const findOneByUserIdAndGroupId = async (user_id, group_id) => {
  try {
    console.error(user_id, group_id);
    return await models.group_user.findOne({ where: { user_id: user_id, group_id: group_id } });
  } catch (e) {
    console.error(e.message);
  }
};

const updateUserRoleInGroup = async (user_id, group_id, group_user_role_id) => {
  try {
    return await models.group_user.update(
      { group_user_role_id: group_user_role_id },
      { where: { user_id: user_id, group_id: group_id } },
    );
  } catch (e) {
    console.error(e.message);
  }
};

module.exports = { createGroupUser, findOneByUserIdAndGroupId, updateUserRoleInGroup };
