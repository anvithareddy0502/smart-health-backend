module.exports = (sequelize, DataTypes) => {
  const Medicine = sequelize.define("Medicine", {
    name: DataTypes.STRING,
    dosage: DataTypes.STRING,

    type: DataTypes.STRING,             

    schedule: DataTypes.JSON,            

    count: DataTypes.INTEGER,           

    expiry: DataTypes.DATEONLY,

    lowNotified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

    expiryNotified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  return Medicine;
};