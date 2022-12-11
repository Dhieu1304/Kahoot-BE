const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'slide_type',
    {
      id: {
        autoIncrement: true,
        autoIncrementIdentity: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      parent_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'slide_parent_type',
          key: 'id',
        },
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'slide_type',
      schema: 'public',
      timestamps: true,
      indexes: [
        {
          name: 'slide_type_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
      ],
    },
  );
};
