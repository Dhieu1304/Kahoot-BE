const { slideParentTypeService } = require('../service.init');

const getAllType = async (req, res) => {
  const data = await slideParentTypeService.getAllSlideType();
  return res.status(200).json({ status: true, message: 'Successful', data });
};

module.exports = {
  getAllType,
};
