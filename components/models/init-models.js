const DataTypes = require("sequelize").DataTypes;
const _Users = require("../user/user.model");

function initModels(sequelize) {
    const Users = _Users(sequelize, DataTypes);


    return {
        Users,
    };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
