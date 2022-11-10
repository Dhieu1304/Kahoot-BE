const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Users', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: "Users_email_key"
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        role: {
            type: DataTypes.STRING(10),
            allowNull: true,
            defaultValue: "STUDENT"
        },
        status: {
            type: DataTypes.STRING(10),
            allowNull: true,
            defaultValue: "ENABLE"
        },
        password: {
            type: DataTypes.STRING(256),
            allowNull: true
        }
    }, {
        sequelize,
        tableName: 'Users',
        schema: 'public',
        timestamps: true,
        indexes: [
            {
                name: "Users_email_key",
                unique: true,
                fields: [
                    { name: "email" },
                ]
            },
            {
                name: "Users_pkey",
                unique: true,
                fields: [
                    { name: "id" },
                ]
            },
        ]
    });
};
