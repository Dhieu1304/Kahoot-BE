const { slideService, slideDataService } = require('../service.init');
const convertDataSlide = require('../utils/convertDataSlide');
const presentations = require('../socket/socketPresentation').getInstance();

const updateSlidePresentation = async (req, res) => {
  let { data, presentation_id } = req.body;
  const dataRes = [];
  for (let i = 0; i < data.length; i++) {
    data[i].presentation_id = presentation_id;
    dataRes.push(Object.assign({}, data[i]));
    data[i].body = JSON.stringify(data[i].body);
  }
  // await slideDataService.deleteAllDataOfPresent(presentation_id);
  const isEdit = await slideService.editMultiSlide(presentation_id, data);
  if (!isEdit) {
    return res
      .status(400)
      .json({ status: false, message: 'Can not update this presentation, please check your input' });
  }
  return res.status(200).json({ status: true, message: 'Successful', data: dataRes });
};

const deleteSlideData = async (req, res) => {
  const { presentation_id } = req.body;
  await slideDataService.deleteAllDataOfPresent(presentation_id);
  return res.status(200).json({ status: true, message: 'Successful' });
};

const getSlideData = async (req, res) => {
  const { presentation_id, ordinal_slide_number } = req.query;
  const slide = await slideService.findOneSlide(presentation_id, ordinal_slide_number);
  if (slide && slide.slide_type_id === 1) {
    const dataCount = await slideService.dataCountSlide(presentation_id, ordinal_slide_number);
    convertDataSlide(slide.body, dataCount);
  }
  return res.status(200).json({ status: true, message: 'Successful', data: slide });
};

/*
const getSlideClient = async (req, res) => {
  const { code } = req.query;
  const presentSocket = presentations.findCurrentSlideByCode(code);
  let slide = 'Please wait the host present slide';
  if (presentSocket) {
    slide = await slideService.findOneSlide(presentSocket.presentation_id, presentSocket.ordinal_slide_number);
  }
  const data = {
    slide,
  }
  return res.status(200).json({ status: true, message: 'Successful', data });
};*/

module.exports = {
  updateSlidePresentation,
  deleteSlideData,
  getSlideData,
  // getSlideClient,
};
