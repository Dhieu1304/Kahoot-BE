const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'group_user',
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
      group_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'group',
          key: 'id',
        },
      },
      group_user_role_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'group_user_role',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      tableName: 'group_user',
      schema: 'public',
      timestamps: true,
      indexes: [
        {
          name: 'group_user_pkey',
          unique: true,
          fields: [{ name: 'user_id' }, { name: 'group_id' }],
        },
      ],
    },
  );
};
