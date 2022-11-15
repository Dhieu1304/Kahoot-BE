const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'verify_type',
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
        unique: 'verify_type_name_key',
      },
    },
    {
      sequelize,
      tableName: 'verify_type',
      schema: 'public',
      timestamps: false,
      indexes: [
        {
          name: 'verify_type_name_key',
          unique: true,
          fields: [{ name: 'name' }],
        },
        {
          name: 'verify_type_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
      ],
    },
  );
};
