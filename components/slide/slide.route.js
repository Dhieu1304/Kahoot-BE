const slideParentTypeController = require('../slide-parent-type/slide-parent-type.controller');
const express = require('express');
const router = express.Router();

router.get('/type', slideParentTypeController.getAllType);

module.exports = router;
