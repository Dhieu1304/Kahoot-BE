const models = require('../models');

const findOneByName = async (name) => {
  try {
    return await models.group_user_role.findOne({ where: { name: name } });
  } catch (e) {
    console.error(e.message);
  }
};

module.exports = {
  findOneByName,
};
