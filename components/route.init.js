const authRouter = require('./auth/auth.route');
const userRouter = require('./user/user.route');
const groupRouter = require('./group/group.route');
const verifyTypeRouter = require('./verify-type/verify-type.route');
const uploadRouter = require('./upload/upload.route');
const groupUserRouter = require('./group-user/group-user.route');
const presentationRouter = require('./presentation/presentation.route');
const slideRouter = require('./slide/slide.route');
const presentationMemberRouter = require('./presentation-member/presentation-member.route');
const presentationGroupRouter = require('./presentation-group/presentation-group.route');
const express = require('express');

module.exports.initRouter = (app) => {
  app.use('/auth', authRouter);
  app.use('/user', userRouter);
  app.use('/group', groupRouter);
  app.use('/verify-type', verifyTypeRouter);
  app.use('/upload', uploadRouter);
  app.use('/group-user', groupUserRouter);
  app.use('/presentation', presentationRouter);
  app.use('/slide', slideRouter);
  app.use('/presentation-member', presentationMemberRouter);
  app.use('/presentation-group', presentationGroupRouter);
  app.use(express.Router().get('/'), (req, res) => {
    return res.status(200).send('KAHOOT_API');
  });
};
