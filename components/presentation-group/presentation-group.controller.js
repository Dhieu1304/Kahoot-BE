const presentationService = require('./presentation-group.service');
const { presentationMemberService } = require('../service.init');

const listGroupPresentation = async (req, res) => {
  const { presentation_id } = req.query;
  const data = await presentationService.findAllGroupPresentation(presentation_id);
  return res.status(200).json({ status: true, message: 'Successful', data });
};

const addGroupPresentation = async (req, res) => {
  const { presentation_id, group_id } = req.body;
  const { id } = req.user;
  const checkOwner = await presentationMemberService.findOnePresentationMember(id, 1, presentation_id);
  if (!checkOwner) {
    return res.status(400).json({ status: false, message: 'You do not have permission' });
  }
  const data = await presentationService.addGroupPresentation(presentation_id, group_id);
  if (data) {
    return res.status(200).json({ status: true, message: 'Successful' });
  }
  return res.status(400).json({ status: false, message: 'Validation error' });
};

const removeGroupPresentation = async (req, res) => {
  const { presentation_id, group_id } = req.body;
  const { id } = req.user;
  const checkOwner = await presentationMemberService.findOnePresentationMember(id, 1, presentation_id);
  if (!checkOwner) {
    return res.status(400).json({ status: false, message: 'You do not have permission' });
  }
  const data = await presentationService.removeGroupPresentation(presentation_id, group_id);
  if (data) {
    return res.status(200).json({ status: true, message: 'Successful' });
  }
  return res.status(400).json({ status: false, message: 'Validation error' });
};

module.exports = {
  listGroupPresentation,
  addGroupPresentation,
  removeGroupPresentation,
};
