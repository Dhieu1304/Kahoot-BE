const { slideService, slideDataService, presentationMemberService } = require('../service.init');
const convertDataSlide = require('../utils/convertDataSlide');
const { PRESENTATION_EVENT } = require('../socket/socket.constant');
const toJSON = require('../utils/toJSON');
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
  let slide = await slideService.findOneSlide(presentation_id, ordinal_slide_number);
  if (slide && slide.slide_type_id === 1) {
    slide = toJSON(slide);
    slide.submitBy = await slideDataService.getSlideDataUsers(presentation_id, ordinal_slide_number);
    const dataCount = await slideService.dataCountSlide(presentation_id, ordinal_slide_number);
    convertDataSlide(slide.body, dataCount);
  }
  return res.status(200).json({ status: true, message: 'Successful', data: slide });
};

const submitAnswer = async (req, res) => {
  const { code, name, uid } = req.body;
  const presentation = presentations.findCurrentSlideByCode(code);
  if (!presentation) {
    return res.status(400).json({ status: false, message: 'This presentation not present' });
  }
  if (presentation.type === 2) {
    if (!req.user) {
      return res.status(400).json({ status: false, message: 'This is private presentation, please login to continue' });
    }
    const presentationMember = await presentationMemberService.findOneByPresentAndUserId(
      req.user.id,
      presentation.presentation_id,
    );
    if (!presentationMember) {
      return res.status(400).json({ status: false, message: 'You do not have permission' });
    }
  }
  await slideDataService.createNewSlideData({
    presentation_id: presentation.presentation_id,
    ordinal_slide_number: presentation.ordinal_slide_number,
    user_id: req.user?.id,
    uid,
    name,
    value: 1,
  });
  const slide = await slideService.findOneSlide(presentation.presentation_id, presentation.ordinal_slide_number);
  if (slide.slide_type_id === 1) {
    const dataCount = await slideService.dataCountSlide(
      presentation.presentation_id,
      presentation.ordinal_slide_number,
    );
    convertDataSlide(slide.body, dataCount);
  }
  _io.in(presentation.presentation_id.toString()).emit(PRESENTATION_EVENT.SLIDE_DATA, slide);
  return res.status(200).json({ status: true, message: 'Successful' });
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
  submitAnswer,
  // getSlideClient,
};
