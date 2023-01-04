const DataTypes = require('sequelize').DataTypes;
const _group = require('../group/group.model');
const _group_user = require('../group-user/group-user.model');
const _group_user_role = require('../group-user-role/group-user-role.model');
const _role = require('../role/role.model');
const _user = require('../user/user.model');
const _user_status = require('../user-status/user-status.model');
const _verify = require('../verify/verify.model');
const _verify_type = require('../verify-type/verify-type.model');
const _presentation_type = require('../presentation-type/presentation-type.model');
const _presentation = require('../presentation/presentation.model');
const _presentation_member = require('../presentation-member/presentation-member.model');
const _slide_parent_type = require('../slide-parent-type/slide-parent-type.model');
const _slide_type = require('../slide-type/slide-type.model');
const _slide = require('../slide/slide.model');
const _slide_data = require('../slide-data/slide-data.model');
const _presentation_theme = require('../presentation-theme/presentation-theme.model');
const _slide_message = require('../slide-message/slide-message.model');
const _slide_question = require('../slide-question/slide-question.model');
const _presentation_group = require('../presentation-group/presentation-group.model');

function initModels(sequelize) {
  const verify_type = _verify_type(sequelize, DataTypes);
  const group_user_role = _group_user_role(sequelize, DataTypes);
  const role = _role(sequelize, DataTypes);
  const user_status = _user_status(sequelize, DataTypes);
  const group = _group(sequelize, DataTypes);
  const user = _user(sequelize, DataTypes);
  const verify = _verify(sequelize, DataTypes);
  const group_user = _group_user(sequelize, DataTypes);
  const presentation_theme = _presentation_theme(sequelize, DataTypes);
  const presentation_type = _presentation_type(sequelize, DataTypes);
  const presentation = _presentation(sequelize, DataTypes);
  const presentation_member = _presentation_member(sequelize, DataTypes);
  const slide_parent_type = _slide_parent_type(sequelize, DataTypes);
  const slide_type = _slide_type(sequelize, DataTypes);
  const slide = _slide(sequelize, DataTypes);
  const slide_data = _slide_data(sequelize, DataTypes);
  const slide_message = _slide_message(sequelize, DataTypes);
  const slide_question = _slide_question(sequelize, DataTypes);
  const presentation_group = _presentation_group(sequelize, DataTypes);

  group.belongsToMany(user, {
    as: 'user_id_users',
    through: group_user,
    foreignKey: 'group_id',
    otherKey: 'user_id',
  });
  user.belongsToMany(group, {
    as: 'group_id_groups',
    through: group_user,
    foreignKey: 'user_id',
    otherKey: 'group_id',
  });
  user.belongsToMany(verify_type, {
    as: 'verify_type_id_verify_types',
    through: verify,
    foreignKey: 'user_id',
    otherKey: 'verify_type_id',
  });
  verify_type.belongsToMany(user, {
    as: 'user_id_user_verifies',
    through: verify,
    foreignKey: 'verify_type_id',
    otherKey: 'user_id',
  });
  group_user.belongsTo(group, { as: 'group', foreignKey: 'group_id' });
  group.hasMany(group_user, { as: 'group_users', foreignKey: 'group_id' });
  group_user.belongsTo(group_user_role, {
    as: 'group_user_role',
    foreignKey: 'group_user_role_id',
  });
  group_user_role.hasMany(group_user, {
    as: 'group_users',
    foreignKey: 'group_user_role_id',
  });
  user.belongsTo(role, { as: 'role', foreignKey: 'role_id' });
  role.hasMany(user, { as: 'users', foreignKey: 'role_id' });
  group_user.belongsTo(user, { as: 'user', foreignKey: 'user_id' });
  user.hasMany(group_user, { as: 'group_users', foreignKey: 'user_id' });
  verify.belongsTo(user, { as: 'user', foreignKey: 'user_id' });
  user.hasMany(verify, { as: 'verifies', foreignKey: 'user_id' });
  user.belongsTo(user_status, { as: 'status', foreignKey: 'status_id' });
  user_status.hasMany(user, { as: 'users', foreignKey: 'status_id' });
  verify.belongsTo(verify_type, {
    as: 'verify_type',
    foreignKey: 'verify_type_id',
  });
  verify_type.hasMany(verify, { as: 'verifies', foreignKey: 'verify_type_id' });
  presentation.belongsTo(presentation_type, { as: 'presentation_type', foreignKey: 'presentation_type_id' });
  presentation_type.hasMany(presentation, { as: 'presentations', foreignKey: 'presentation_type_id' });
  presentation_member.belongsTo(group_user_role, { as: 'role', foreignKey: 'role_id' });
  group_user_role.hasMany(presentation_member, { as: 'presentation_members', foreignKey: 'role_id' });
  presentation_member.belongsTo(presentation, { as: 'presentation', foreignKey: 'presentation_id' });
  presentation.hasMany(presentation_member, { as: 'presentation_members', foreignKey: 'presentation_id' });
  presentation_member.belongsTo(user, { as: 'user', foreignKey: 'user_id' });
  user.hasMany(presentation_member, { as: 'presentation_members', foreignKey: 'user_id' });
  slide_type.belongsTo(slide_parent_type, { as: 'parent_type', foreignKey: 'parent_type_id' });
  slide_parent_type.hasMany(slide_type, { as: 'slide_types', foreignKey: 'parent_type_id' });
  slide.belongsTo(slide_type, { as: 'slide_type', foreignKey: 'slide_type_id' });
  slide_type.hasMany(slide, { as: 'slides', foreignKey: 'slide_type_id' });
  slide.belongsTo(presentation, { as: 'presentation', foreignKey: 'presentation_id' });
  presentation.hasMany(slide, { as: 'slides', foreignKey: 'presentation_id' });
  slide_data.belongsTo(presentation, { as: 'presentation', foreignKey: 'presentation_id' });
  presentation.hasMany(slide_data, { as: 'slide_data', foreignKey: 'presentation_id' });
  slide_data.belongsTo(user, { as: 'user', foreignKey: 'user_id' });
  user.hasMany(slide_data, { as: 'slide_data', foreignKey: 'user_id' });
  presentation.belongsTo(presentation_theme, { as: 'presentation_theme', foreignKey: 'presentation_theme_id' });
  presentation_theme.hasMany(presentation, { as: 'presentations', foreignKey: 'presentation_theme_id' });
  slide_question.belongsTo(presentation, { as: 'presentation', foreignKey: 'presentation_id' });
  presentation.hasMany(slide_question, { as: 'slide_questions', foreignKey: 'presentation_id' });
  slide_question.belongsTo(user, { as: 'user', foreignKey: 'user_id' });
  user.hasMany(slide_question, { as: 'slide_questions', foreignKey: 'user_id' });
  slide_message.belongsTo(presentation, { as: 'presentation', foreignKey: 'presentation_id' });
  presentation.hasMany(slide_message, { as: 'slide_messages', foreignKey: 'presentation_id' });
  slide_message.belongsTo(user, { as: 'user', foreignKey: 'user_id' });
  user.hasMany(slide_message, { as: 'slide_messages', foreignKey: 'user_id' });
  group.belongsToMany(presentation, {
    as: 'presentation_id_presentations',
    through: presentation_group,
    foreignKey: 'group_id',
    otherKey: 'presentation_id',
  });
  presentation.belongsToMany(group, {
    as: 'group_id_group_presentation_groups',
    through: presentation_group,
    foreignKey: 'presentation_id',
    otherKey: 'group_id',
  });
  presentation_group.belongsTo(group, { as: 'group', foreignKey: 'group_id' });
  group.hasMany(presentation_group, { as: 'presentation_groups', foreignKey: 'group_id' });
  presentation_group.belongsTo(presentation, { as: 'presentation', foreignKey: 'presentation_id' });
  presentation.hasMany(presentation_group, { as: 'presentation_groups', foreignKey: 'presentation_id' });

  return {
    group,
    group_user,
    group_user_role,
    role,
    user,
    user_status,
    verify,
    verify_type,
    presentation,
    presentation_type,
    presentation_member,
    slide_parent_type,
    slide_type,
    slide,
    slide_data,
    presentation_theme,
    slide_message,
    slide_question,
    presentation_group,
  };
}

module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
