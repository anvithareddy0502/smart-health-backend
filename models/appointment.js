module.exports = (sequelize, DataTypes) => {
  const Appointment = sequelize.define("Appointment", {

    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    doctor: {
      type: DataTypes.STRING,
      allowNull: false
    },

    hospital: {
      type: DataTypes.STRING,
      allowNull: false
    },

    date: {
      type: DataTypes.STRING
    },

    time: {
      type: DataTypes.STRING
    },

    status: {
      type: DataTypes.STRING,
      defaultValue: "upcoming"
    }

  });

  Appointment.associate = (models) => {
    Appointment.belongsTo(models.User);
  };

  return Appointment;
};