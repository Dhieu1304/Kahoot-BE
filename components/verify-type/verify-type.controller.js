const { verifyTypeService } = require('../service.init');

module.exports.getAll = async (req, res) => {
  const data = await verifyTypeService.findAllVerifyType();
  return res.status(200).json({ status: true, data });
};
