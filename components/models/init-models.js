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

function initModels(sequelize) {
  const verify_type = _verify_type(sequelize, DataTypes);
  const group_user_role = _group_user_role(sequelize, DataTypes);
  const role = _role(sequelize, DataTypes);
  const user_status = _user_status(sequelize, DataTypes);
  const group = _group(sequelize, DataTypes);
  const user = _user(sequelize, DataTypes);
  const verify = _verify(sequelize, DataTypes);
  const group_user = _group_user(sequelize, DataTypes);
  const presentation_type = _presentation_type(sequelize, DataTypes);
  const presentation = _presentation(sequelize, DataTypes);
  const presentation_member = _presentation_member(sequelize, DataTypes);

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
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
