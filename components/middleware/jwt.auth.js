const authService = require('../auth/auth.service');

module.exports.jwtAuth = async function (req, res, next) {
  const { authorization } = req.headers;
  try {
    if (!authorization) return res.status(401).json({ status: false, message: `No bearer token attached.` });
    if (!authorization.startsWith('Bearer'))
      return res.status(200).json({ status: false, message: `Not a bearer token.` });
    const token = authorization.split('Bearer ')[1];
    if (!token) return res.status(401).json({ status: false, message: `Invalid token.` });
    const decoded = await authService.verifyToken(token);
    if (decoded) req.user = decoded;
    else return res.status(401).json({ status: false, message: `Invalid token.` });
    next();
  } catch (e) {
    console.error(e.message);
    return res.status(400).json({
      status: false,
      message: 'Internal error server',
    });
  }
};

module.exports.isHasJWT = async function (req, res, next) {
  const { authorization } = req.headers;
  try {
    if (authorization && authorization.startsWith('Bearer')) {
      const token = authorization.split('Bearer ')[1];
      if (token) {
        const decoded = await authService.verifyToken(token);
        if (decoded) {
          req.user = decoded;
        }
      }
    }
    next();
  } catch (e) {
    console.error(e.message);
    return res.status(400).json({
      status: false,
      message: 'Internal error server',
    });
  }
};

module.exports.socketJwtAuth = async function (socket) {
  try {
    if (!socket.handshake.query || !socket.handshake.query.token) {
      return false;
    }
    console.log('Socket Token: ', socket.handshake.query.token);
    const decoded = await authService.verifyToken(socket.handshake.query.token);
    if (decoded) {
      socket.user = decoded;
      return true;
    }
    return false;
  } catch (e) {
    console.error(e.message);
    return false;
  }
};
