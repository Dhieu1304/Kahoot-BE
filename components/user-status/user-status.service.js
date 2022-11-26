const models = require('../models');

const findOneUserStatusByName = async (name) => {
  try {
    return await models.user_status.findOne({ where: { name: name } });
  } catch (e) {
    console.error(e.message);
  }
};

module.exports = {
  findOneUserStatusByName,
};
