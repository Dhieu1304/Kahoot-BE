const {
  presentationService,
  presentationTypeService,
  groupUserRoleService,
  presentationMemberService,
  slideService,
  cryptoService,
  slideDataService,
} = require('../service.init');
const { GROUP_USER_ROLE } = require('../group-user-role/group-user-role.constant');
const { randomSixNumber } = require('../utils/randomNumber');
const pick = require('../utils/pick');
const toJSON = require('../utils/toJSON');
const { PRESENTATION_EVENT } = require('../socket/socket.constant');
const convertDataSlide = require('../utils/convertDataSlide');
const presentations = require('../socket/socketPresentation').getInstance();
const users = require('../socket/socketUser').getInstance();

const getOwnerPresentation = async (presentation_id) => {
  const ownerPresentation = await presentationMemberService.findOwner(presentation_id);
  return {
    id: ownerPresentation.user.id,
    full_name: ownerPresentation.user.full_name,
    email: ownerPresentation.user.email,
    avatar: ownerPresentation.user.avatar,
  };
};

const getOwnerFromMembers = (members) => {
  for (let i = 0; i < members.length; i++) {
    if (members[i]?.role?.name === GROUP_USER_ROLE.OWNER) {
      return members[i]?.user;
    }
  }
};

const getListPresentation = async (req, res) => {
  const { id } = req.user;
  let { type } = req.query;
  if (type === GROUP_USER_ROLE.MEMBER) {
    type = null;
  }
  const listPresentation = await presentationService.listPresentation(id, type);
  const listPresentationRes = toJSON(listPresentation);
  if (listPresentationRes) {
    for (let i = 0; i < listPresentationRes.length; i++) {
      listPresentationRes[i].owner = await getOwnerPresentation(listPresentationRes[i].id);
    }
    return res.status(200).json({ status: true, message: 'Successful', data: listPresentationRes });
  }
  return res.status(400).json({ status: false, message: 'Error' });
};

const createNewPresentation = async (req, res) => {
  const { id } = req.user;
  const { name, type, themeId } = req.body;
  const typePresentation = await presentationTypeService.findOneByName(type);
  const code = randomSixNumber();
  const newPresentation = await presentationService.createNewPresentation({
    name,
    code,
    presentation_type_id: typePresentation.id,
    presentation_theme_id: themeId,
  });
  const ownerRole = await groupUserRoleService.findOneByName(GROUP_USER_ROLE.OWNER);
  const presentationMember = await presentationMemberService.createNewPresentationMember(
    id,
    ownerRole.id,
    newPresentation.id,
  );
  if (presentationMember) {
    return res.status(200).json({ status: true, message: 'Successful', data: newPresentation });
  }
  return res.status(400).json({ status: false, message: 'Error' });
};

const editPresentation = async (req, res) => {
  const { id } = req.user;
  const { presentationId } = req.body;
  const body = pick(req.body, ['name', 'presentation_type_id', 'presentation_theme_id']);
  const presentation = await presentationService.findOneById(presentationId);
  if (!presentation) {
    return res.status(400).json({ status: false, message: 'Invalid presentation' });
  }
  const checkCanEdit = await presentationMemberService.checkCanEdit(id, presentationId);
  if (!checkCanEdit) {
    return res.status(403).json({ status: false, message: 'You do not have permission to edit' });
  }
  const updatedPresentation = await presentationService.updatePresentation(presentationId, body);
  if (updatedPresentation) {
    return res.status(200).json({ status: true, message: 'Successful' });
  }
  return res.status(400).json({ status: false, message: 'Error' });
};

const getPresentationDetail = async (req, res) => {
  const { id } = req.params;
  const presentationDetail = await presentationService.getDetailPresentation(id);
  if (!presentationDetail) {
    return res.status(400).json({ status: false, message: 'Do not find this presentation' });
  }
  const presentationRes = toJSON(presentationDetail);
  presentationRes.owner = getOwnerFromMembers(presentationRes?.presentation_members);
  return res.status(200).json({ status: true, message: 'Successful', data: presentationRes });
};

const getAllSlidePresentation = async (req, res) => {
  const { id } = req.params;
  const presentationDetail = await slideService.getAllSlidePresentation(id);
  for (let i = 0; i < presentationDetail.length; i++) {
    presentationDetail[i].body = JSON.parse(presentationDetail[i].body);
  }
  return res.status(200).json({ status: true, message: 'Successful', data: presentationDetail });
};

const deletePresentation = async (req, res) => {
  const { id } = req.user;
  const { presentation_id } = req.body;
  const ownerRole = await groupUserRoleService.findOneByName(GROUP_USER_ROLE.OWNER);
  const presentationMember = await presentationMemberService.findOnePresentationMember(
    id,
    ownerRole.id,
    presentation_id,
  );
  if (!presentationMember) {
    return res.status(400).json({ status: false, message: 'You not permission to delete this presentation' });
  }
  await presentationService.deletePresentationById(presentation_id);
  return res.status(200).json({ status: true, message: 'Delete successful' });
};

const deleteSession = async (req, res) => {
  const { id } = req.user;
  const { presentation_id } = req.body;
  const presentationMember = await presentationMemberService.findOneByPresentAndUserId(presentation_id, id);
  if (!presentationMember || presentationMember.role_id === 3) {
    return res.status(400).json({ status: false, message: 'You do not have permission' });
  }
  await presentationService.deletePresentSession(presentation_id);
  return res.status(200).json({ status: true, message: 'Delete successful' });
};

const present = async (req, res) => {
  const { id } = req.user;
  const { presentation_id } = req.body;
  const presentation = await presentationService.findOneById(presentation_id);
  if (!presentation) {
    return res.status(200).json({ status: false, message: 'Invalid presentation' });
  }
  const presentationMember = await presentationMemberService.findOneByPresentAndUserId(presentation_id, id);
  if (!presentationMember || presentationMember.role_id === 3) {
    return res.status(200).json({ status: false, message: 'You do not have permission to present' });
  }
  const presentSocket = presentations.findCurrentSlideByCode(presentation.code);
  let ordinal_slide_number;
  let slide;
  if (!presentSocket) {
    ordinal_slide_number = 1;
    presentations.addPresentation(
      presentation_id,
      presentation.code,
      ordinal_slide_number,
      presentation.presentation_type_id,
      id,
    );
    slide = await slideService.findOneSlide(presentation_id, ordinal_slide_number);
    if (!slide) {
      return res.status(200).json({ status: false, message: 'No slide found' });
    }
    if (slide && slide.slide_type_id === 1) {
      slide = toJSON(slide);
      slide.submitBy = await slideDataService.getSlideDataUsers(presentation_id, ordinal_slide_number);
    }
    _io.in(presentation.code.toString()).emit(PRESENTATION_EVENT.SLIDE, slide);
  } else {
    ordinal_slide_number = presentSocket.ordinal_slide_number;
    slide = await slideService.findOneSlide(presentation_id, ordinal_slide_number);
  }
  if (!slide) {
    return res.status(200).json({ status: false, message: 'No slide found' });
  }
  const count_slide = await slideService.countSlidePresentation(presentation_id);
  if (slide && slide.slide_type_id === 1) {
    const dataCount = await slideService.dataCountSlide(presentation_id, ordinal_slide_number);
    convertDataSlide(slide.body, dataCount);
  }
  const encrypted = await cryptoService.encryptData({
    user_id: id,
    presentation_id,
    code: presentation.code,
    date: new Date().getTime() + 60 * 1000,
  });
  const data = {
    count_slide,
    ordinal_slide_number,
    slide,
    join_host: encrypted,
  };
  return res.status(200).json({ status: true, message: 'Successful', data });
};

const presentOtherSlide = async (req, res) => {
  const { id } = req.user;
  const { presentation_id, ordinal_slide_number } = req.body;
  const presentation = await presentationService.findOneById(presentation_id);
  if (!presentation) {
    return res.status(400).json({ status: false, message: 'Invalid presentation' });
  }
  const presentationMember = await presentationMemberService.findOneByPresentAndUserId(presentation_id, id);
  if (!presentationMember || presentationMember.role_id === 3) {
    return res.status(400).json({ status: false, message: 'You do not have permission to present' });
  }
  const presentSocket = presentations.findCurrentSlideByCode(presentation.code);
  if (!presentSocket) {
    return res.status(400).json({ status: false, message: `Please present this slide` });
  }
  presentations.addPresentation(presentation_id, presentSocket.code, ordinal_slide_number);
  let slide = await slideService.findOneSlide(presentation_id, ordinal_slide_number);
  if (slide && slide.slide_type_id === 1) {
    slide = toJSON(slide);
    slide.submitBy = await slideDataService.getSlideDataUsers(presentation_id, ordinal_slide_number);
    const dataCount = await slideService.dataCountSlide(presentation_id, ordinal_slide_number);
    convertDataSlide(slide.body, dataCount);
  }
  _io.in(presentation.code.toString()).emit(PRESENTATION_EVENT.SLIDE, slide);
  _io.in(presentation.id.toString()).emit(PRESENTATION_EVENT.SLIDE_DATA, slide);
  return res.status(200).json({ status: true, message: `Change to slide ${ordinal_slide_number}` });
};

const clientJoin = async (req, res) => {
  const { code } = req.body;
  const presentation = await presentationService.findOneByCode(code);
  if (!presentation) {
    return res.status(200).json({ status: false, message: 'Invalid presentation' });
  }
  if (presentation.presentation_type_id === 2) {
    if (!req.user) {
      return res.status(200).json({ status: false, message: 'This is private present, please login to continue' });
    }
    const presentationMember = await presentationMemberService.findOneByPresentAndUserId(presentation.id, req.user?.id);
    const checkUserPresentationGroup = await presentationService.checkUserPresentationGroup(
      presentation.id,
      req.user?.id,
    );
    if (!presentationMember && !checkUserPresentationGroup) {
      return res.status(200).json({ status: false, message: 'You do not have permission to join' });
    }
  }
  const presentSocket = presentations.findCurrentSlideByCode(presentation.code);
  let slide;
  if (presentSocket) {
    slide = await slideService.findOneSlide(presentation.id, presentSocket.ordinal_slide_number);
  }
  if (slide && slide.slide_type_id === 1) {
    slide = toJSON(slide);
    slide.submitBy = await slideDataService.getSlideDataUsers(presentation.id, presentSocket.ordinal_slide_number);
  }
  _io.in(presentation.id.toString()).emit(PRESENTATION_EVENT.COUNT_ONL, users.countUserInRoom(code));
  const encrypted = await cryptoService.encryptData({
    presentation_id: presentation.id,
    code: presentation.code,
    date: new Date().getTime() + 60 * 1000,
  });
  const data = {
    slide,
    join_client: encrypted,
  };
  return res.status(200).json({ status: true, message: 'Successful', data });
};

const getData = async (req, res) => {
  const { presentation_id } = req.body;
  const presentation = await presentationService.findOneById(presentation_id);
  if (!presentation) {
    return res.status(200).json({ status: false, message: 'Invalid presentation' });
  }
  const presentationMember = await presentationMemberService.findOneByPresentAndUserId(presentation_id, req.user.id);
  if (!presentationMember || presentationMember.role_id === 3) {
    return res.status(400).json({ status: false, message: 'You do not have permission to view detail' });
  }
  const presentationData = await slideDataService.getPresentationData(presentation_id);
  if (presentationData) {
    const data = toJSON(presentationData);
    for (let i = 0; i < data.length; i++) {
      if (!data[i].user) {
        data[i].user = {
          user_id: null,
          full_name: 'Anonymous',
          avatar: null,
        };
      }
    }
    return res.status(200).json({ status: true, message: 'Successful', data });
  }
  return res.status(400).json({ status: false, message: 'Error, please try again later' });
};

module.exports = {
  getListPresentation,
  createNewPresentation,
  editPresentation,
  getPresentationDetail,
  getAllSlidePresentation,
  deletePresentation,
  deleteSession,
  present,
  clientJoin,
  presentOtherSlide,
  getData,
};
