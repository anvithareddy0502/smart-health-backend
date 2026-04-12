const express = require("express");
const router = express.Router();
const { User } = require("../models");

// SAVE / UPDATE PROFILE
router.post("/save", async (req, res) => {
  const { uid, name, dob, age, gender } = req.body;

  try {
    let user = await User.findOne({ where: { uid } });

    if (!user) {
      user = await User.create({ uid, name, dob, age, gender });
    } else {
      await user.update({ name, dob, age, gender });
    }

    res.json({ message: "Profile saved", user });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to save profile" });
  }
});

// GET PROFILE
router.get("/:uid", async (req, res) => {
  try {
    const user = await User.findOne({
      where: { uid: req.params.uid }
    });

    if (!user) return res.json({});

    res.json(user);

  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

module.exports = router;