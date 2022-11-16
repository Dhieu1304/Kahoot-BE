const models = require('../models');
const { createMockupDataFromObject } = require('../utils/createMockupDataFromObject');
const { USER_STATUS } = require('./user-status.constant');
const { sleep } = require('../utils/sleep');

(async () => {
  try {
    await sleep(2000);
    const userStatus = await models.user_status.findAll();
    if (userStatus.length === 0) {
      console.log('Init user status data');
      const data = createMockupDataFromObject(USER_STATUS);
      await models.user_status.bulkCreate(data);
    }
  } catch (e) {
    console.error(e.message);
  }
})();

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
