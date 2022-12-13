const { slideService } = require('../service.init');
const updateSlidePresentation = async (req, res) => {
  let { data } = req.body;
  const presentation_id = data[0].presentation_id;
  for (let i = 0; i < data.length; i++) {
    data[i].body = JSON.stringify(data[i].body);
  }
  await slideService.editMultiSlide(presentation_id, data);
  return res.status(200).json({ status: true, message: 'Successful' });
};

module.exports = {
  updateSlidePresentation,
};
