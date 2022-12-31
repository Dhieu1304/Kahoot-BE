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

const getListPresentation = async (req, res) => {
  const { id } = req.user;
  const { page, limit } = req.query;
  const listPresentation = await presentationService.listPresentation(id, limit, page * limit);
  if (listPresentation) {
    return res.status(200).json({ status: true, message: 'Successful', data: listPresentation });
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
  const { presentationId, name, type, themeId } = req.body;
  const body = pick(req.body, ['presentationId', 'name', 'presentation_type_id', 'presentation_theme_id']);
  console.log('body', body);
  const presentation = await presentationService.findOneById(body.presentationId);
  if (!presentation) {
    return res.status(400).json({ status: false, message: 'Invalid presentation' });
  }
  const checkCanEdit = await presentationMemberService.checkCanEdit(id, body.presentationId);
  if (!checkCanEdit) {
    return res.status(403).json({ status: false, message: 'You do not have permission to edit' });
  }
  delete body.presentationId;
  console.log('body', body);
  return;
  const updatedPresentation = await presentationService.updatePresentation(presentationId, body);
  if (updatedPresentation) {
    return res.status(200).json({ status: true, message: 'Successful' });
  }
  return res.status(400).json({ status: false, message: 'Error' });
};

const getPresentationDetail = async (req, res) => {
  const { id } = req.params;
  const presentationDetail = await presentationService.getDetailPresentation(id);
  return res.status(200).json({ status: true, message: 'Successful', data: presentationDetail });
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
