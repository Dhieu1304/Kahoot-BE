const models = require('../models');
const { createMockupDataFromObject } = require('../utils/createMockupDataFromObject');
const { GROUP_USER_ROLE } = require('./group-user-role.constant');
const { sleep } = require('../utils/sleep');

(async () => {
  try {
    await sleep(2000);
    const groupUserRole = await models.group_user_role.findAll();
    if (groupUserRole.length === 0) {
      console.log('Init group user role data');
      const data = createMockupDataFromObject(GROUP_USER_ROLE);
      await models.group_user_role.bulkCreate(data);
    }
  } catch (e) {
    console.error(e.message);
  }
})();

module.exports = {};
