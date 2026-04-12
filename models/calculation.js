// backend/models/calculation.js - Standard Sequelize model (no require('./index'))
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Calculation extends Model {
    // Add associations here if needed later
    static associate(models) {
      // Example: Calculation.belongsTo(models.User);
    }
  }

  Calculation.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    uid: {
      type: DataTypes.STRING,
      allowNull: false
    },
    calculatorType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    inputs: {
      type: DataTypes.JSON,
      allowNull: false
    },
    score: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    interpretation: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Calculation',
    tableName: 'calculations',
    timestamps: false
  });

  return Calculation;
};