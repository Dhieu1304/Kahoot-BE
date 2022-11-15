const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'user_status',
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
        unique: 'user_status_name_key',
      },
    },
    {
      sequelize,
      tableName: 'user_status',
      schema: 'public',
      timestamps: false,
      indexes: [
        {
          name: 'user_status_name_key',
          unique: true,
          fields: [{ name: 'name' }],
        },
        {
          name: 'user_status_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
      ],
    },
  );
};
