const { slideService, slideDataService } = require('../service.init');

const updateSlidePresentation = async (req, res) => {
  let { data, presentation_id } = req.body;
  for (let i = 0; i < data.length; i++) {
    data[i].presentation_id = presentation_id;
    data[i].body = JSON.stringify(data[i].body);
  }
  await slideDataService.deleteAllDataOfPresent(presentation_id);
  const isEdit = await slideService.editMultiSlide(presentation_id, data);
  if (!isEdit) {
    return res
      .status(400)
      .json({ status: false, message: 'Can not update this presentation, please check your input' });
  }
  return res.status(200).json({ status: true, message: 'Successful', data });
};

module.exports = {
  updateSlidePresentation,
};
