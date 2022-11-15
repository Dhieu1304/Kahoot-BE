const initModels = require('./init-models');
const db = require('../../config/database.config');
const models = initModels(db);

(async () => {
  try {
    // init role
    const roles = await models.role.findAll();
    if (roles.length === 0) {
      console.log('Init role data');
      const data = [
        { name: 'TEACHER' },
        { name: 'STUDENT' },
        { name: 'ADMIN' },
      ];
      await models.role.bulkCreate(data);
    }

    // init group user role
    const groupUserRole = await models.group_user_role.findAll();
    if (groupUserRole.length === 0) {
      console.log('Init group user role data');
      const data = [
        { name: 'OWNER' },
        { name: 'CO_OWNER' },
        { name: 'MEMBER' },
      ];
      await models.group_user_role.bulkCreate(data);
    }

    // init user status
    const userStatus = await models.user_status.findAll();
    if (userStatus.length === 0) {
      console.log('Init user status data');
      const data = [
        { name: 'ACTIVE' },
        { name: 'IN_ACTIVE' },
        { name: 'BLOCK' },
        { name: 'DELETE' },
      ];
      await models.user_status.bulkCreate(data);
    }

    // init verify type
    const verifyTypes = await models.verify_type.findAll();
    if (verifyTypes.length === 0) {
      console.log('Init verify type data');
      const data = [{ name: 'RESET_PASSWORD' }, { name: 'VERIFY_MAIL' }];
      await models.verify_type.bulkCreate(data);
    }
  } catch (e) {
    console.error(e.message);
  }
})();

module.exports = models;
