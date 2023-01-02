const {
  presentationService,
  presentationTypeService,
  groupUserRoleService,
  presentationMemberService,
  slideService,
} = require('../service.init');
const { GROUP_USER_ROLE } = require('../group-user-role/group-user-role.constant');
const { randomSixNumber } = require('../utils/randomNumber');
const pick = require('../utils/pick');
const toJSON = require('../utils/toJSON');

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
  const presentationMember = await presentationMemberService.findOnePresentationMember(id, presentation_id);
  if (!presentationMember || [1, 2].includes(presentationMember.role_id)) {
    return res.status(400).json({ status: false, message: 'You not permission to delete this presentation' });
  }
  await presentationService.deletePresentSession(presentation_id);
  return res.status(200).json({ status: true, message: 'Delete successful' });
};

module.exports = {
  getListPresentation,
  createNewPresentation,
  editPresentation,
  getPresentationDetail,
  getAllSlidePresentation,
  deletePresentation,
  deleteSession,
};
