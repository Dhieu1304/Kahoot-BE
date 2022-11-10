const authService = require("../auth/auth.service");

module.exports.jwtAuth = async function (req, res, next) {
    const { authorization } = req.headers;
    try {
        if (!authorization)
            return res.status(401).json({ status: false,  message: `No bearer token attached.` });
        if (!authorization.startsWith('Bearer'))
            return res.status(200).json({ status: false, message: `Not a bearer token.` });
        const token = authorization.split("Bearer ")[1];
        if (!token)
            return res.status(401).json({ status: false, message: `Invalid token.` });
        const decoded = await authService.verifyToken(token);
        if (decoded)
            req.user = decoded;
        else
            return res.status(401).json({ status: false, message: `Invalid token.` });
        next();
    }
    catch (e) {
        console.log(e.message);
        return res.status(400).json({
            status: false,
            message: 'Internal error server'
        })
    }
}