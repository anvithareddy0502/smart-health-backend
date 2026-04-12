const express = require('express');
const router = express.Router();
const { User, Medicine } = require('../models');
const sendNotification = require("../utils/sendNotification");

// ================= ADD MEDICINE =================
router.post('/add', async (req, res) => {
  try {
    const { uid, name, dosage, type, schedule, count, expiryDate } = req.body;

    const user = await User.findOne({ where: { uid } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const med = await Medicine.create({
      name,
      dosage,
      type,
      schedule,
      count: Number(count),
      expiry: expiryDate,
      UserId: user.id
    });

    res.json(med);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

// ================= GET MEDS =================
router.get('/:uid', async (req, res) => {
  const user = await User.findOne({ where: { uid: req.params.uid } });
  if (!user) return res.json([]);

  const meds = await Medicine.findAll({ where: { UserId: user.id } });
  res.json(meds);
});

// ================= UPDATE COUNT + NOTIFY =================
router.put('/take/:id', async (req, res) => {
  try {
    const med = await Medicine.findByPk(req.params.id);

    if (!med) {
      return res.status(404).json({ error: "Medicine not found" });
    }

    // 🔻 decrease count
    if (med.count > 0) {
      med.count = med.count - 1;
      await med.save();
    }

    // 🔔 SEND NOTIFICATION
    const user = await User.findByPk(med.UserId);

    await sendNotification(
      user.fcm_tokens,
      "💊 Medicine Taken",
      `${med.name} marked as taken`
    );

    res.json(med);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

// ================= DELETE =================
router.delete('/:id', async (req, res) => {
  await Medicine.destroy({ where: { id: req.params.id } });
  res.json({ message: "Deleted" });
});

module.exports = router;