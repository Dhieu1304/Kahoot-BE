const models = require('../models');
const { roleService, userStatusService, authService } = require('../service.init');
const { v4: uuidv4 } = require('uuid');
const { USER_STATUS } = require('../user-status/user-status.constant');
const { ROLE } = require('../role/role.constant');
const { sleep } = require('../utils/sleep');

const getGroupByUserId = async (id, raw = false) => {
  try {
    return await models.group.findAll();
  } catch (e) {
    console.error(e.message);
    return { status: false, message: e.message };
  }
};

module.exports = {
  createUser,
};
