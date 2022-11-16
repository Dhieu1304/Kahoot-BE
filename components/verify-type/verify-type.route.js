const express = require('express');
const router = express.Router();

const verifyTypeController = require('./verify-type.controller');

router.get('/get-all', verifyTypeController.getAll);

module.exports = router;
