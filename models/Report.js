module.exports = (sequelize, DataTypes) => {
  const Report = sequelize.define("Report", {
    name: DataTypes.STRING,
    path: DataTypes.STRING,
    date: DataTypes.STRING,
    time: DataTypes.STRING,
    userId: DataTypes.STRING
  });

  return Report;
};