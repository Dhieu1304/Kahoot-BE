const models = require('../models');
const { verifyTypeService } = require('../service.init');

module.exports.findOneVerifyByUserIdAndType = async (userId, type) => {
  try {
    return await models.verify.findOne({
      where: { user_id: userId },
      include: [
        {
          model: models.verify_type,
          as: 'verify_type',
          where: { name: type },
        },
      ],
    });
  } catch (e) {
    console.error(e.message);
  }
};

module.exports.createNewVerify = async (userId, type, code) => {
  try {
    const typeId = await verifyTypeService.findOneVerifyTypeByName(type);
    const existsData = await models.verify.findOne({ user_id: userId, verify_type_id: typeId.id });
    if (existsData) {
      existsData.code = code;
      return await existsData.save();
    }
    return await models.verify.create({ user_id: userId, verify_type_id: typeId.id, code: code });
  } catch (e) {
    console.error(e.message);
  }
};
