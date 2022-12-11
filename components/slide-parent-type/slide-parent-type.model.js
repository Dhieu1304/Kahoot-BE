const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'slide_parent_type',
    {
      id: {
        autoIncrement: true,
        autoIncrementIdentity: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'slide_parent_type',
      schema: 'public',
      timestamps: true,
      indexes: [
        {
          name: 'slide_parent_type_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
      ],
    },
  );
};
