const models = require('../models');

const createGroupUser = async ({ user_id, group_id, group_user_role_id }) => {
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

module.exports = { createGroupUser };
