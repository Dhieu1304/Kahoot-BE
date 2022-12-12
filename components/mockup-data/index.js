const xlsx = require('node-xlsx');
const { createMockData } = require('../utils/createMockData');
const models = require('../models');
const { createMockupDataFromObject } = require('../utils/createMockupDataFromObject');
const { GROUP_USER_ROLE } = require('../group-user-role/group-user-role.constant');
const { ROLE } = require('../role/role.constant');
const { USER_STATUS } = require('../user-status/user-status.constant');
const { VERIFY_TYPE } = require('../verify-type/verify-type.constant');
const db = require('../../config/database.config');
const { PRESENTATION_TYPE } = require('../presentation-type/presentation-type.constant');

(async () => {
  if (process.env.DB_SYNC === '1') {
    try {
      console.log('----------------------------------------------------------');
      await db.sync({ force: true });

      let data = createMockupDataFromObject(GROUP_USER_ROLE);
      await models.group_user_role.bulkCreate(data);

      data = createMockupDataFromObject(ROLE);
      await models.role.bulkCreate(data);

      data = createMockupDataFromObject(USER_STATUS);
      await models.user_status.bulkCreate(data);

      data = createMockupDataFromObject(VERIFY_TYPE);
      await models.verify_type.bulkCreate(data);

      data = xlsx.parse(__dirname + '/data/group.xlsx');
      await models.group.bulkCreate(createMockData(data[0].data));

      data = xlsx.parse(__dirname + '/data/user.xlsx');
      await models.user.bulkCreate(createMockData(data[0].data));

      data = xlsx.parse(__dirname + '/data/groupUser.xlsx');
      await models.group_user.bulkCreate(createMockData(data[0].data));

      data = createMockupDataFromObject(PRESENTATION_TYPE);
      await models.presentation_type.bulkCreate(data);

      data = xlsx.parse(__dirname + '/data/slideParentType.xlsx');
      await models.slide_parent_type.bulkCreate(createMockData(data[0].data));

      data = xlsx.parse(__dirname + '/data/slideType.xlsx');
      await models.slide_type.bulkCreate(createMockData(data[0].data));

      data = xlsx.parse(__dirname + '/data/presentationTheme.xlsx');
      await models.presentation_theme.bulkCreate(createMockData(data[0].data));

      console.log('-----------------------FINISHED INIT DATABASE-----------------------');
    } catch (e) {
      console.error(e.message);
    }
  }
})();
