const express = require('express');
const router = express.Router();
const { Calculation } = require('../models');// Adjust path if needed

// POST /api/health-results/save - Save a health calculation result
router.post('/save', async (req, res) => {
  const { uid, calculatorType, inputs, score, interpretation } = req.body;

  try {
    const result = await Calculation.create({
      uid,
      calculatorType,
      inputs,
      score,
      interpretation
    });
    res.status(201).json(result);
  } catch (err) {
    console.error('Save health result error:', err);
    res.status(500).json({ error: 'Failed to save health result' });
  }
});

// GET /api/health-results/:uid - Fetch user's health results history
router.get('/:uid', async (req, res) => {
  try {
    const results = await Calculation.findAll({
      where: { uid: req.params.uid },
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'uid', 'calculatorType', 'inputs', 'score', 'interpretation', 'createdAt'] // ← Explicitly list columns
    });
    res.json(results);
  } catch (err) {
    console.error('Fetch health results error:', err);
    res.status(500).json({ error: 'Failed to fetch health results' });
  }
});

module.exports = router;