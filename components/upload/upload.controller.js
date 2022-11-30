const uploadService = require('./upload.service');

const uploadPicture = async (req, res) => {
  console.log('req: ', req);
  console.log('req.body: ', req.body);

  const file = req.file;

  // if (!req.file) {
  if (!file) {
    return res.status(400).json({ status: false, message: 'Invalid file' });
  }
  const data = await uploadService.uploadFile(file, 'picture');
  return res.status(200).json({ status: true, data });
};

module.exports = {
  uploadPicture,
};
