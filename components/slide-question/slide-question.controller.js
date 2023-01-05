const pick = require('../utils/pick');
const {
  presentationService,
  slideQuestionService,
  userService,
  presentationMemberService,
} = require('../service.init');
const { CHAT_EVENT, QUESTION_EVENT } = require('../socket/socket.constant');
const toJSON = require('../utils/toJSON');
const checkInput = require('../utils/checkInput');

const getListQuestion = async (req, res) => {
  const data = pick(req.query, ['presentation_id', 'code', 'uid']);
  const validateInput = checkInput(data.presentation_id, data.code, data.uid, req.user?.id);
  if (!validateInput.status) {
    return res.status(400).json(validateInput || { status: false, message: 'Input required' });
  }
  const presentation = await presentationService.getPresentationByCodeOrId(data.presentation_id, data.code);
  if (!presentation) {
    return res.status(400).json({ status: false, message: 'Presentation invalid' });
  }
  const checkPrivatePresent = await presentationMemberService.checkPrivatePresentation(
    presentation.id,
    presentation.presentation_type_id,
    req.user?.id,
  );
  if (!checkPrivatePresent || !checkPrivatePresent.status) {
    return res.status(400).json(checkPrivatePresent || { status: false, message: 'Error' });
  }
  const question = await slideQuestionService.findByPresentationId(presentation.id);
  if (question) {
    const dataQuestion = toJSON(question);
    for (let i = 0; i < dataQuestion.length; i++) {
      dataQuestion.vote_by = JSON.parse(dataQuestion.vote_by);
    }
    return res.status(200).json({ status: true, message: 'Successful', data: dataQuestion });
  }
  return res.status(400).json({ status: false, message: 'Error' });
};

const newQuestion = async (req, res) => {
  const data = pick(req.body, ['presentation_id', 'code', 'uid', 'question']);
  const validateInput = checkInput(data.presentation_id, data.code, data.uid, req.user?.id);
  if (!validateInput.status) {
    return res.status(400).json(validateInput || { status: false, message: 'Input required' });
  }
  const presentation = await presentationService.getPresentationByCodeOrId(data.presentation_id, data.code);
  if (!presentation) {
    return res.status(400).json({ status: false, message: 'Presentation invalid' });
  }
  const checkPrivatePresent = await presentationMemberService.checkPrivatePresentation(
    presentation.id,
    presentation.presentation_type_id,
    req.user?.id,
  );
  if (!checkPrivatePresent || !checkPrivatePresent.status) {
    return res.status(400).json(checkPrivatePresent || { status: false, message: 'Error' });
  }
  const newQuestion = await slideQuestionService.createNewSlideQuestion(
    presentation.id,
    data.question,
    req.user?.id,
    data.uid,
  );
  const userInfo = await userService.findOneByEmail(req.user?.email);
  if (newQuestion) {
    _io.in(presentation.code.toString()).emit(QUESTION_EVENT.NEW_QUESTION, {
      message: data.message,
      user_id: req.user?.id,
      full_name: userInfo?.full_name || 'Anonymous',
      avatar: userInfo?.avatar,
    });
    return res.status(200).json({ status: true, message: 'Successful' });
  }
  return res.status(400).json({ status: false, message: 'Error' });
};

module.exports = {
  newQuestion,
  getListQuestion,
};
