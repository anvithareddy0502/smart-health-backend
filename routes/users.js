const express = require('express');
const router = express.Router();
const { User, sequelize } = require('../models');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


// ================= AUTH MIDDLEWARE =================
const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ error: "No token" });
    }

    const decoded = jwt.verify(token, "SECRET_KEY");
    req.user = decoded;

    next();

  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

// ================= SIGNUP =================
router.post("/signup", async (req, res) => {
  try {
    const { uid, email, password } = req.body;

    if (!uid || !email || !password) {
      return res.status(400).json({ error: "All fields required" });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: "User already exists" });
    }

    // 🔐 hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      uid,
      email,
      password: hashedPassword
    });

    res.json({ message: "Signup successful", user });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 🔐 compare hashed password
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { uid: user.uid },
      "SECRET_KEY",
      { expiresIn: "1h" }
    );

    res.json({
      token,
      uid: user.uid
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= PROFILE UPDATE =================
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { uid, age, gender, medicalHistory } = req.body;

    if (!uid) {
      return res.status(400).json({ error: 'UID is required' });
    }

    let user = await User.findOne({ where: { uid } });

    if (!user) {
      user = await User.create({
        uid,
        age,
        gender,
        medicalHistory: medicalHistory ? JSON.stringify(medicalHistory) : null
      });
    } else {
      await user.update({
        age,
        gender,
        medicalHistory: medicalHistory
          ? JSON.stringify(medicalHistory)
          : user.medicalHistory
      });
    }

    res.status(200).json({
      message: 'Profile saved/updated successfully',
      user: {
        uid: user.uid,
        age: user.age,
        gender: user.gender,
        medicalHistory: user.medicalHistory
          ? JSON.parse(user.medicalHistory)
          : null
      }
    });

  } catch (error) {
    res.status(500).json({ error: 'Server error while saving profile' });
  }
});

// ================= SAVE FCM TOKEN =================
router.post("/update-fcm", async (req, res) => {
  try {
    const { uid, token } = req.body;

    const user = await User.findOne({ where: { uid } });

    if (!user) return res.status(404).json({ msg: "User not found" });

    user.fcmToken = token;
    await user.save();

    res.json({ msg: "Token saved" });

  } catch (err) {
    res.status(500).json({ msg: "Error saving token" });
  }
});

// ================= GET PROFILE =================
router.get('/profile/:uid', authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ where: { uid: req.params.uid } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      uid: user.uid,
      age: user.age,
      gender: user.gender,
      medicalHistory: user.medicalHistory
        ? JSON.parse(user.medicalHistory)
        : null,
      fcm_tokens: user.fcm_tokens || []
    });

  } catch (error) {
    res.status(500).json({ error: 'Server error while fetching profile' });
  }
});
// ================= TEST NOTIFICATION =================
router.get('/test-notification', async (req, res) => {
  try {
    const user = await User.findOne();

    if (!user || !user.fcm_tokens || user.fcm_tokens.length === 0) {
      return res.json({ message: "No FCM tokens found" });
    }

    const sendNotification = require("../utils/sendNotification");

    await sendNotification(
      user.fcm_tokens,
      "🔥 Test Notification",
      "Your Smart Health Assistant is working!"
    );

    res.json({ message: "Notification sent successfully!" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;