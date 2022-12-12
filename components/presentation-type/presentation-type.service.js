const models = require('../models');

const findOneByName = async (name) => {
  try {
    return await models.presentation_type.findOne({ where: { name: name } });
  } catch (e) {
    console.error(e.message);
  }
};

module.exports = {
  findOneByName,
};
