const pick = require('../utils/pick');
const {
  presentationService,
  slideQuestionService,
  userService,
  presentationMemberService,
} = require('../service.init');
const { QUESTION_EVENT } = require('../socket/socket.constant');
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
      if (dataQuestion.vote_by) {
        dataQuestion.vote_by = JSON.parse(dataQuestion.vote_by);
      }
      if (!dataQuestion[i].user) {
        dataQuestion[i].user = {
          user_id: null,
          full_name: 'Anonymous',
          avatar: null,
        };
      }
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
  if (newQuestion) {
    const userInfo = await userService.findOneByEmail(req.user?.email);
    _io.in(presentation.code.toString()).emit(QUESTION_EVENT.NEW_QUESTION, {
      question: data.question,
      user_id: req.user?.id,
      full_name: userInfo?.full_name || 'Anonymous',
      avatar: userInfo?.avatar,
      uid: data.uid,
    });
    return res.status(200).json({ status: true, message: 'Successful' });
  }
  return res.status(400).json({ status: false, message: 'Error' });
};

const upVoteQuestion = async (req, res) => {
  const data = pick(req.body, ['presentation_id', 'code', 'uid', 'question_id']);
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
  const upVoteQuestion = await slideQuestionService.upVoteQuestion(data.question_id, req.user?.id || data.uid);
  if (upVoteQuestion) {
    /*const userInfo = await userService.findOneByEmail(req.user?.email);
      _io.in(presentation.code.toString()).emit(QUESTION_EVENT.NEW_QUESTION, {
      question: data.question,
      user_id: req.user?.id,
      full_name: userInfo?.full_name || 'Anonymous',
      avatar: userInfo?.avatar,
      uid: data.uid,
    });*/
    return res.status(200).json({ status: true, message: 'Successful' });
  }
  return res.status(400).json({ status: false, message: 'Error' });
};

const downVoteQuestion = async (req, res) => {
  const data = pick(req.body, ['presentation_id', 'code', 'uid', 'question_id']);
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
  const downVoteQuestion = await slideQuestionService.downVoteQuestion(data.question_id, req.user?.id || data.uid);
  if (downVoteQuestion) {
    /*const userInfo = await userService.findOneByEmail(req.user?.email);
      _io.in(presentation.code.toString()).emit(QUESTION_EVENT.NEW_QUESTION, {
      question: data.question,
      user_id: req.user?.id,
      full_name: userInfo?.full_name || 'Anonymous',
      avatar: userInfo?.avatar,
      uid: data.uid,
    });*/
    return res.status(200).json({ status: true, message: 'Successful' });
  }
  return res.status(400).json({ status: false, message: 'Error' });
};

module.exports = {
  newQuestion,
  getListQuestion,
  upVoteQuestion,
  downVoteQuestion,
};
