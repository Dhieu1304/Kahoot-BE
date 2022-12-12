const models = require('../models');
const { Op } = require('sequelize');
const { GROUP_USER_ROLE } = require('./group-user-role.constant');

const findOneByName = async (name) => {
  try {
    return await models.group_user_role.findOne({ where: { name: name } });
  } catch (e) {
    console.error(e.message);
  }
};

const findIdCanEdit = async () => {
  try {
    const editRole = await models.group_user_role.findAll({
      where: {
        name: {
          [Op.in]: [GROUP_USER_ROLE.OWNER, GROUP_USER_ROLE.CO_OWNER],
        },
      },
    });
    const result = [];
    for (let i = 0; i < editRole.length; i++) {
      result.push(editRole[i].id);
    }
    return result;
  } catch (e) {
    console.error(e.message);
  }
};

module.exports = {
  findOneByName,
  findIdCanEdit,
};
