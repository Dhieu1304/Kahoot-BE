const bcrypt = require('bcryptjs');
const userService = require('../user/user.service');
const jwt = require('jsonwebtoken');

module.exports.register = async (user) => {
    return await userService.createUser(user);
}

module.exports.hashPassword = async(password) => {
    try {
        return await bcrypt.hash(password, 10);
    } catch (e) {
        console.error(e.message);
        return false;
    }
}

module.exports.comparePassword = async(password, hashPassword) => {
    try {
        return await bcrypt.compare(password, hashPassword);
    } catch (e) {
        console.error(e.message);
        return false;
    }
}

module.exports.generateToken = async (email, role) => {
    try {
        return jwt.sign( { email, role },
            process.env.SECRET_KEY,
            {
                expiresIn: process.env.TIME_EXPIRE,
            }
        );
    }
    catch (e) {
        console.log(e.message);
        return { status: false, message: 'Error generate token' };
    }

}

module.exports.verifyToken = async (token) => {
    try {
        return jwt.verify(token, process.env.SECRET_KEY);
    }
    catch (e) {
        console.error(e.message);
        return false;
    }
}
