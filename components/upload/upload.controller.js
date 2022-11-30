const uploadService = require('./upload.service');

const uploadPicture = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ status: false, message: 'Invalid file' });
  }
  const data = await uploadService.uploadFile(req.file, 'picture');
  return res.status(200).json({ status: true, data });
};

module.exports = {
  uploadPicture,
};
