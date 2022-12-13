const { slideService, slideDataService } = require('../service.init');

const updateSlidePresentation = async (req, res) => {
  let { data, presentation_id } = req.body;
  for (let i = 0; i < data.length; i++) {
    const option = [];
    data[i].presentation_id = presentation_id;
    for (let j = 0; j < data[i].body.length; j++) {
      option.push(data[i].body[j].name);
    }
    await slideDataService.deleteAllExceptInput(presentation_id, data[i].ordinal_slide_number, option);
    data[i].body = JSON.stringify(data[i].body);
  }
  await slideService.editMultiSlide(presentation_id, data);
  return res.status(200).json({ status: true, message: 'Successful' });
};

module.exports = {
  updateSlidePresentation,
};
