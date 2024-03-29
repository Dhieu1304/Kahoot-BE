const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'slide',
    {
      presentation_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'presentation',
          key: 'id',
        },
      },
      ordinal_slide_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      slide_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'slide_type',
          key: 'id',
        },
      },
      title: {
        type: DataTypes.STRING(1000),
        allowNull: true,
      },
      body: {
        type: DataTypes.STRING(1000000),
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING(10000),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'slide',
      schema: 'public',
      timestamps: true,
      indexes: [
        {
          name: 'slide_pkey',
          unique: true,
          fields: [{ name: 'presentation_id' }, { name: 'ordinal_slide_number' }],
        },
      ],
    },
  );
};
