'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];

const db = {};

let sequelize;

//  DB CONNECTION
sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
  dialectModule: require("better-sqlite3"),
  logging: false
});



//  LOAD ALL MODELS AUTOMATICALLY
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

// 🔗 ASSOCIATIONS
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// 📤 EXPORT
db.sequelize = sequelize;
db.Sequelize = Sequelize;

console.log('✅ Sequelize initialized. Models:', Object.keys(db));

module.exports = db;