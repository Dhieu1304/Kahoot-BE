const { VERIFY_TYPE } = require('./verify-type.constant');
const models = require('../models');
const { createMockupDataFromObject } = require('../utils/createMockupDataFromObject');
const { sleep } = require('../utils/sleep');

(async () => {
  try {
    await sleep(2000);
    const verifyTypes = await models.verify_type.findAll();
    if (verifyTypes.length === 0) {
      console.log('Init verify type data');
      const data = createMockupDataFromObject(VERIFY_TYPE);
      await models.verify_type.bulkCreate(data);
    }
  } catch (e) {
    console.error(e.message);
  }
})();

module.exports.findAllVerifyType = async () => {
  try {
    return await models.verify_type.findAll();
  } catch (e) {
    console.error(e.message);
  }
};
