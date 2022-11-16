const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'group',
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
      member_can_share_content: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      member_can_share_assign_to_group: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      member_can_invite_new_people: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      member_can_see_other: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      tableName: 'group',
      schema: 'public',
      timestamps: true,
      indexes: [
        {
          name: 'group_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
      ],
    },
  );
};
