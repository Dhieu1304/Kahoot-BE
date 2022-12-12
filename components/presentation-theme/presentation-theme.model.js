const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'presentation_theme',
    {
      id: {
        autoIncrement: true,
        autoIncrementIdentity: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      text_color: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      background_color: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'presentation_theme',
      schema: 'public',
      timestamps: true,
      indexes: [
        {
          name: 'presentation_theme_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
      ],
    },
  );
};
