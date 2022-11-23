const models = require('../models');
const { roleService, userStatusService, authService } = require('../service.init');
const { v4: uuidv4 } = require('uuid');
const { USER_STATUS } = require('../user-status/user-status.constant');
const { ROLE } = require('../role/role.constant');
const { sleep } = require('../utils/sleep');

(async () => {
  try {
    await sleep(3000);
    const data = await findOneByEmail('admin@gmail.com');
    if (!data) {
      console.log('init admin account');
      const password = await authService.hashPassword('admin');
      const userStatus = await userStatusService.findOneUserStatusByName(USER_STATUS.ACTIVE);
      const userRole = await roleService.findOneRoleByName(ROLE.ADMIN);
      const admin = {
        email: 'admin@gmail.com',
        password,
        uid: uuidv4(),
        status_id: userStatus.id,
        role_id: userRole.id,
      };
      await models.user.create(admin);
    }
  } catch (e) {
    console.error(e.message);
  }
})();

const createUser = async (user) => {
  try {
    const data = await models.user.create(user);
    return { status: true, data, message: 'Create Successful' };
  } catch (e) {
    console.error(e.message);
    return { status: false, message: e.message };
  }
};

const findOneByEmail = async (email) => {
  try {
    return await models.user.findOne({ where: { email: email } });
  } catch (e) {
    console.error(e.message);
    return { status: false, message: e.message };
  }
};

const getInfoByEmail = async (email) => {
  try {
    const user = await models.user.findOne({ where: { email: email }, raw: true });
    delete user.password;
    delete user.refresh_token;
    delete user.uid;
    delete user.createdAt;
    delete user.updatedAt;
    return user;
  } catch (e) {
    console.error(e.message);
  }
};

const findOneDetailByEmail = async (email) => {
  try {
    return await models.user.findOne({ where: { email: email }, include: ['status', 'role'] });
  } catch (e) {
    console.error(e.message);
    return { status: false, message: e.message };
  }
};

const updateUserByEmail = async (email, updateObject) => {
  try {
    return await models.user.update(updateObject, { where: { email: email } });
  } catch (e) {
    console.error(e.message);
    return { status: false, message: e.message };
  }
};

const findOneByRefreshToken = async (refreshToken) => {
  try {
    return await models.user.findOne({ where: { refresh_token: refreshToken }, raw: true });
  } catch (e) {
    console.error(e.message);
    return { status: false, message: e.message };
  }
};

module.exports = {
  createUser,
  findOneByEmail,
  findOneDetailByEmail,
  updateUserByEmail,
  getInfoByEmail,
  findOneByRefreshToken,
};
