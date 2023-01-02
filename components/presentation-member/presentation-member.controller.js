const { presentationMemberService } = require('../service.init');

const listMember = async (req, res) => {
  const { presentation_id } = req.query;
  const data = await presentationMemberService.findAllByPresentationId(presentation_id);
  res.status(200).json({ status: true, message: 'Successful', data });
};

const addMember = async (req, res) => {
  const { id } = req.user;
  const { presentation_id, user_id } = req.body;
  const checkPermission = await presentationMemberService.checkCanEdit(id, presentation_id);
  if (!checkPermission) {
    return res.status(400).json({ status: false, message: 'You do not have permission' });
  }
  const data = await presentationMemberService.addPresentationMember(presentation_id, user_id);
  if (data) {
    return res.status(200).json({ status: true, message: 'Successful' });
  }
  return res.status(400).json({ status: false, message: 'Validation error' });
};

const removeMember = async (req, res) => {
  const { id } = req.user;
  const { presentation_id, user_id } = req.body;
  const checkPermission = await presentationMemberService.checkCanEdit(id, presentation_id);
  if (!checkPermission) {
    return res.status(400).json({ status: false, message: 'You do not have permission' });
  }
  const data = await presentationMemberService.removePresentationMember(presentation_id, user_id);
  if (data) {
    return res.status(200).json({ status: true, message: 'Successful' });
  }
  return res.status(400).json({ status: false, message: 'Validation error' });
};

module.exports = {
  listMember,
  addMember,
  removeMember,
};
