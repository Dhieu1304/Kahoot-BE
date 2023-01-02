const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'presentation_group',
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
      group_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'group',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      tableName: 'presentation_group',
      schema: 'public',
      timestamps: true,
      indexes: [
        {
          name: 'presentation_group_pkey',
          unique: true,
          fields: [{ name: 'presentation_id' }, { name: 'group_id' }],
        },
      ],
    },
  );
};
