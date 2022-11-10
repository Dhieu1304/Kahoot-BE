const { models } = require('../models');

module.exports.createUser = async (user) => {
    try {
        const data = await models.Users.create(user);
        return { status: true, data, message: 'Successfully' };
    } catch (e) {
        console.error(e.message);
        return { status: false, message: e.message };
    }
}

module.exports.findOneByEmail = async (email) => {
    try {
        return await models.Users.findOne({ where: { email: email} });
    } catch (e) {
        console.error(e.message);
        return { status: false, message: e.message };
    }
}
