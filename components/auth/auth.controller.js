const authService = require('./auth.service');
const userService = require('../user/user.service');

module.exports.register = async (req, res) => {
    const { email, password, name, role } = req.body;
    const exitsUser = await userService.findOneByEmail(email);
    if (exitsUser) {
        return res.status(400).json({ status: false, message: `${email} already used, please try another email` });
    }
    const hashPassword = await authService.hashPassword(password);
    const user = { email, password: hashPassword, name, role };
    const data = await authService.register(user);
    const status = data.status ? 200 : 400 || 500;
    return res.status(status).json(data);
}

module.exports.login = async (req, res) => {
    const { email, password } = req.body;
    const exitsUser = await userService.findOneByEmail(email);
    if (!exitsUser) {
        return res.status(400).json({ status: false, message: `No account with email: ${email}` });
    }
    const isMatchPassword = await authService.comparePassword(password, exitsUser.password);
    if (!isMatchPassword) {
        return res.status(400).json({ status: false, message: `Wrong password` });
    }
    const token = await authService.generateToken(exitsUser.email, exitsUser.role);
    return res.status(200).json({ status: true, data: { token } });
}
