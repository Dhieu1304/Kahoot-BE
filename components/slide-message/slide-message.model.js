const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'slide_message',
    {
      id: {
        autoIncrement: true,
        autoIncrementIdentity: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      presentation_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'presentation',
          key: 'id',
        },
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'user',
          key: 'id',
        },
      },
      message: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      uid: {
        type: DataTypes.UUID,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'slide_message',
      schema: 'public',
      timestamps: true,
      indexes: [
        {
          name: 'slide_message_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
      ],
    },
  );
};
