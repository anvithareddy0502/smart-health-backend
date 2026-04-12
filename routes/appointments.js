const express = require('express');
const router = express.Router();
const { User, Appointment } = require('../models');
const sendNotification = require("../utils/sendNotification");

// ================= ADD APPOINTMENT =================
router.post('/add', async (req, res) => {
  try {
    const { uid, doctor, hospital, date, time } = req.body;

    const user = await User.findOne({ where: { uid } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const appt = await Appointment.create({
      doctor,
      hospital,
      date,
      time,
      status: "upcoming",
      UserId: user.id
    });

    // 🔔 SEND NOTIFICATION
    await sendNotification(
      user.fcm_tokens,
      "📅 Appointment Added",
      `Dr. ${doctor} on ${date}`
    );

    res.json(appt);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= GET APPOINTMENTS =================
router.get('/:uid', async (req, res) => {
  try {
    const user = await User.findOne({ where: { uid: req.params.uid } });
    if (!user) return res.json([]);

    const appts = await Appointment.findAll({
      where: { UserId: user.id },
      order: [["date", "ASC"], ["time", "ASC"]]
    });

    res.json(appts);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= UPDATE STATUS =================
router.put('/status/:id', async (req, res) => {
  try {
    const { status } = req.body;

    const appt = await Appointment.findByPk(req.params.id);
    if (!appt) return res.status(404).json({ error: "Not found" });

    appt.status = status;
    await appt.save();

    // 🔔 SEND NOTIFICATION
    const user = await User.findByPk(appt.UserId);

    await sendNotification(
      user.fcm_tokens,
      "📅 Appointment Updated",
      `Status changed to ${status}`
    );

    res.json(appt);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= DELETE =================
router.delete('/:id', async (req, res) => {
  try {
    console.log("DELETE REQUEST RECEIVED:", req.params.id);

    const appt = await Appointment.findByPk(req.params.id);

    if (!appt) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    const user = await User.findByPk(appt.UserId);

    await appt.destroy();

    // 🔔 SEND NOTIFICATION
    await sendNotification(
      user.fcm_tokens,
      "📅 Appointment Deleted",
      `Appointment removed successfully`
    );

    res.json({ message: "Deleted successfully" });

  } catch (err) {
    console.log("DELETE ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;