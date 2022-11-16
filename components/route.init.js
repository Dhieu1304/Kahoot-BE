const authRouter = require('./auth/auth.route');
const userRouter = require('./user/user.route');
const verifyTypeRouter = require('./verify-type/verify-type.route');

module.exports.initRouter = (app) => {
  app.use('/auth', authRouter);
  app.use('/user', userRouter);
  app.use('/verify-type', verifyTypeRouter);
};
