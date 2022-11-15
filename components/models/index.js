const initModels = require('./init-models');
const db = require('../../config/database.config');
const models = initModels(db);
const { ROLE } = require('../role/role.constant');
const { GROUP_USER_ROLE } = require('../group-user-role/group-user-role.constant');
const { USER_STATUS } = require('../user-status/user-status.constant');
const { VERIFY_TYPE } = require('../verify-type/verify-type.constant');
const { sleep } = require('../utils/sleep');

(async () => {
  try {
    await sleep(1000);
    function createDataFromObject(obj) {
      const data = [];
      for (let i = 0; i < Object.values(obj).length; i++) {
        data.push({ name: Object.values(obj)[i] });
      }
      return data;
    }

    // init role
    const roles = await models.role.findAll();
    if (roles.length === 0) {
      console.log('Init role data');
      const data = createDataFromObject(ROLE);
      await models.role.bulkCreate(data);
    }

    // init group user role
    const groupUserRole = await models.group_user_role.findAll();
    if (groupUserRole.length === 0) {
      console.log('Init group user role data');
      const data = createDataFromObject(GROUP_USER_ROLE);
      await models.group_user_role.bulkCreate(data);
    }

    // init user status
    const userStatus = await models.user_status.findAll();
    if (userStatus.length === 0) {
      console.log('Init user status data');
      const data = createDataFromObject(USER_STATUS);
      await models.user_status.bulkCreate(data);
    }

    // init verify type
    const verifyTypes = await models.verify_type.findAll();
    if (verifyTypes.length === 0) {
      console.log('Init verify type data');
      const data = createDataFromObject(VERIFY_TYPE);
      await models.verify_type.bulkCreate(data);
    }
  } catch (e) {
    console.error(e.message);
  }
})();

module.exports = models;
