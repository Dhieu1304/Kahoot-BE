const models = require('../models');

module.exports.findOneRoleByName = async (name) => {
  try {
    return await models.role.findOne({ where: { name: name } });
  } catch (e) {
    console.error(e.message);
  }
};
