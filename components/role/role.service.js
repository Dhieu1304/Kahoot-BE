const models = require('../models');
const { createMockupDataFromObject } = require('../utils/createMockupDataFromObject');
const { ROLE } = require('./role.constant');
const { sleep } = require('../utils/sleep');

(async () => {
  try {
    await sleep(2000);
    const roles = await models.role.findAll();
    if (roles.length === 0) {
      console.log('Init role data');
      const data = createMockupDataFromObject(ROLE);
      await models.role.bulkCreate(data);
    }
  } catch (e) {
    console.error(e.message);
  }
})();

module.exports.findOneRoleByName = async (name) => {
  try {
    return await models.role.findOne({ where: { name: name } });
  } catch (e) {
    console.error(e.message);
  }
};
