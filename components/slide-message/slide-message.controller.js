const pick = require('../utils/pick');
const { presentationService, slideMessageService, userService, presentationMemberService } = require('../service.init');
const { CHAT_EVENT } = require('../socket/socket.constant');
const toJSON = require('../utils/toJSON');
const checkInput = require('../utils/checkInput');

const getListMessage = async (req, res) => {
  const data = pick(req.query, ['presentation_id', 'code', 'uid', 'page', 'limit']);
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
  const messages = await slideMessageService.findByPresentationId(presentation.id, data.page, data.limit);
  if (messages) {
    const dataMessage = toJSON(messages);
    for (let i = 0; i < dataMessage.length; i++) {
      if (!dataMessage[i].user) {
        dataMessage[i].user = {
          user_id: null,
          full_name: 'Anonymous',
          avatar: null,
        };
      }
    }
    return res.status(200).json({ status: true, message: 'Successful', data: dataMessage });
  }
  return res.status(400).json({ status: false, message: 'Error' });
};

const newMessage = async (req, res) => {
  const data = pick(req.body, ['presentation_id', 'code', 'uid', 'message']);
  if (req.user) delete data.uid;
  const validateInput = checkInput(data.presentation_id, data.code, data?.uid, req.user?.id);
  if (!validateInput.status) {
    return res.status(400).json(validateInput || { status: false, message: 'Input required' });
  }
  const presentation = await presentationService.getPresentationByCodeOrId(data.presentation_id, data.code);
  if (!presentation) {
    return res.status(200).json({ status: false, message: 'Presentation invalid' });
  }
  const checkPrivatePresent = await presentationMemberService.checkPrivatePresentation(
    presentation.id,
    presentation.presentation_type_id,
    req.user?.id,
  );
  if (!checkPrivatePresent || !checkPrivatePresent.status) {
    return res.status(200).json(checkPrivatePresent || { status: false, message: 'Error' });
  }
  const newMessage = await slideMessageService.createNewSlideMessage(
    presentation.id,
    data.message,
    req.user?.id,
    data?.uid,
  );
  const userInfo = await userService.findOneByEmail(req.user?.email);
  if (newMessage) {
    _io.in(presentation.code.toString()).emit(CHAT_EVENT.NEW_MESSAGE, {
      id: newMessage.id,
      message: data.message,
      user_id: req.user?.id,
      full_name: userInfo?.full_name || 'Anonymous',
      avatar: userInfo?.avatar,
      uid: data?.uid,
    });
    return res.status(200).json({ status: true, message: 'Successful' });
  }
  return res.status(400).json({ status: false, message: 'Error' });
};

module.exports = {
  newMessage,
  getListMessage,
};
