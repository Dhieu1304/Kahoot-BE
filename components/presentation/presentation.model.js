const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'presentation',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      presentation_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'presentation_type',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      tableName: 'presentation',
      schema: 'public',
      timestamps: true,
      indexes: [
        {
          name: 'presentation_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
      ],
    },
  );
};
