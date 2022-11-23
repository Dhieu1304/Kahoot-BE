const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'user',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(400),
        allowNull: true,
      },
      full_name: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      avatar: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      uid: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      status_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'user_status',
          key: 'id',
        },
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'role',
          key: 'id',
        },
      },
      refresh_token: {
        type: DataTypes.STRING(2000),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'user',
      schema: 'public',
      timestamps: true,
      indexes: [
        {
          name: 'user_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
      ],
    },
  );
};
