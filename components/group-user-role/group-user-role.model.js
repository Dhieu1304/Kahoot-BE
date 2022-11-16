const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'group_user_role',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: 'group_user_role_name_key',
      },
    },
    {
      sequelize,
      tableName: 'group_user_role',
      schema: 'public',
      timestamps: true,
      indexes: [
        {
          name: 'group_user_role_name_key',
          unique: true,
          fields: [{ name: 'name' }],
        },
        {
          name: 'group_user_role_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
      ],
    },
  );
};
