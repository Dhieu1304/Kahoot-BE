const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'presentation_member',
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'user',
          key: 'id',
        },
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'group_user_role',
          key: 'id',
        },
      },
      presentation_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'presentation',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      tableName: 'presentation_member',
      schema: 'public',
      timestamps: true,
      indexes: [
        {
          name: 'presentation_member_pkey',
          unique: true,
          fields: [{ name: 'user_id' }, { name: 'role_id' }, { name: 'presentation_id' }],
        },
      ],
    },
  );
};
