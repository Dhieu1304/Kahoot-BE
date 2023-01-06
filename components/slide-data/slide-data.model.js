const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'slide_data',
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
      ordinal_slide_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'user',
          key: 'id',
        },
      },
      uid: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      value: {
        type: DataTypes.STRING(1000),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'slide_data',
      schema: 'public',
      timestamps: true,
      indexes: [
        {
          name: 'slide_data_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
      ],
    },
  );
};
