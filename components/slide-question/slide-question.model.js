const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'slide_question',
    {
      id: {
        autoIncrement: true,
        autoIncrementIdentity: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      presentation_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'presentation',
          key: 'id',
        },
      },
      question: {
        type: DataTypes.STRING(1000),
        allowNull: false,
      },
      vote: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      vote_by: {
        type: DataTypes.STRING(10000),
        allowNull: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'user',
          key: 'id',
        },
      },
      uid: {
        type: DataTypes.UUID,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'slide_question',
      schema: 'public',
      timestamps: true,
      indexes: [
        {
          name: 'slide_question_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
      ],
    },
  );
};
