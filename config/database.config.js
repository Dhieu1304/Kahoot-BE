const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelizeLocal = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: 'localhost',
  dialect: 'postgres',
  operatorsAliases: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

const sequelizeHeroku = new Sequelize(process.env.HDB_DATABASE, process.env.HDB_USERNAME, process.env.HDB_PASSWORD, {
  host: process.env.HDB_HOST,
  dialect: 'postgres',
  port: process.env.HDB_PORT,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

const db = process.env.NODE_ENV === 'PRODUCTION' ? sequelizeHeroku : sequelizeLocal;

if (process.env.DB_SYNC === '1') {
  db.sync({ force: true }).then(() => {
    console.log('Drop and re-sync db.');
  });
}

module.exports = db;
