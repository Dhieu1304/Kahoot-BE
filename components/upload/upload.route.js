const express = require('express');
const router = express.Router();
const multer = require('multer');
const uploadController = require('./upload.controller');

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post('/picture', upload.single('file'), uploadController.uploadPicture);

module.exports = router;
