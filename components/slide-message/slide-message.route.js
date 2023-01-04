const slideMessageValidation = require('./slide-message.validation');
const slideMessageController = require('./slide-message.controller');
const express = require('express');
const validate = require('../middleware/validate');
const { jwtAuth } = require('../middleware/jwt.auth');
const router = express.Router();

router.get('/list-message', validate(slideMessageValidation.getList), slideMessageController.getListMessage);
router.post('/new-message', validate(slideMessageValidation.newMessage), slideMessageController.newMessage);

module.exports = router;
