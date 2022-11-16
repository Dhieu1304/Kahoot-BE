const initModels = require('./init-models');
const db = require('../../config/database.config');
const models = initModels(db);
/*

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
    let userStatus = await models.user_status.findAll();
    if (userStatus.length === 0) {
      console.log('Init user status data');
      const data = createDataFromObject(USER_STATUS);
      userStatus = await models.user_status.bulkCreate(data);
    }

    // init verify type
    const verifyTypes = await models.verify_type.findAll();
    if (verifyTypes.length === 0) {
      console.log('Init verify type data');
      const data = createDataFromObject(VERIFY_TYPE);
      await models.verify_type.bulkCreate(data);
    }

    // init admin account
    const adminAccount = await models.user.findOne({ where: { email: 'admin@gmail.com' } });
    if (!adminAccount) {
      console.log('Init admin account');
      const adminStatus = await userStatusService.findOneUserStatusByName(USER_STATUS.ACTIVE);
      const adminRole = await roleService.findOneRoleByName(ROLE.ADMIN);
      const password = await authService.hashPassword('admin');
      const admin = {
        email: 'admin@gmail.com',
        password,
        uid: uuidv4(),
        status_id: adminStatus.id,
        role_id: adminRole.id,
      };
      console.log(admin);
      await models.user.create(admin);
    }
  } catch (e) {
    console.error(e.message);
  }
})();
*/

module.exports = models;
