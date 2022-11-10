const initModels = require('./init-models');
const db = require('../../config/database.config');
module.exports = {
    models: initModels(db),
}
