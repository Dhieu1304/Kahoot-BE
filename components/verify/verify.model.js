const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'verify',
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'user',
          key: 'id',
        },
      },
      verify_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'verify_type',
          key: 'id',
        },
      },
      code: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'verify',
      schema: 'public',
      timestamps: true,
      indexes: [
        {
          name: 'verify_pkey',
          unique: true,
          fields: [{ name: 'user_id' }, { name: 'verify_type_id' }],
        },
      ],
    },
  );
};
