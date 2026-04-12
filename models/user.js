'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Medicine);
      User.hasMany(models.Appointment);
      User.hasMany(models.Calculation);
    }
  }

  User.init({
    uid: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },

    // ✅ ADD THESE (IMPORTANT)
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },

    dob: {
      type: DataTypes.STRING,
      allowNull: true
    },

    age: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    gender: {
      type: DataTypes.ENUM('Male', 'Female', 'Other'),
      allowNull: true
    },

    medicalHistory: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    // 🔔 For notifications (keep this)
    fcmTokens: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    }

  }, {
    sequelize,
    modelName: 'User',
    underscored: true,
    tableName: 'users'
  });

  return User;
};