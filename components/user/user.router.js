const express = require('express');
const router = express.Router();
const userController = require("./user.controller");
const { jwtAuth } = require("../middleware/jwt.auth");

router.get('/info', jwtAuth, userController.info);

module.exports = router;
