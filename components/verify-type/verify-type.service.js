const models = require('../models');

module.exports.findAllVerifyType = async () => {
  try {
    return await models.verify_type.findAll();
  } catch (e) {
    console.error(e.message);
  }
};

module.exports.findOneVerifyTypeByName = async (name) => {
  try {
    return await models.verify_type.findOne({ where: { name: name } });
  } catch (e) {
    console.error(e.message);
  }
};
