const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'presentation_type',
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
      },
    },
    {
      sequelize,
      tableName: 'presentation_type',
      schema: 'public',
      timestamps: true,
      indexes: [
        {
          name: 'presentation_type_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
      ],
    },
  );
};
