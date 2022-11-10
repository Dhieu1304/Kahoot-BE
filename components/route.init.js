const authRouter = require('./auth/auth.router');
const userRouter = require('./user/user.router');

module.exports.initRouter = (app) => {
    app.use('/auth', authRouter);
    app.use('/user', userRouter);
}
