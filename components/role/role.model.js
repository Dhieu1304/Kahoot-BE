const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'role',
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
        unique: 'role_name_key',
      },
    },
    {
      sequelize,
      tableName: 'role',
      schema: 'public',
      timestamps: true,
      indexes: [
        {
          name: 'role_name_key',
          unique: true,
          fields: [{ name: 'name' }],
        },
        {
          name: 'role_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
      ],
    },
  );
};
