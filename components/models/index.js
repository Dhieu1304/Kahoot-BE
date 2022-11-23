const initModels = require('./init-models');
const db = require('../../config/database.config');
const models = initModels(db);

module.exports = models;
