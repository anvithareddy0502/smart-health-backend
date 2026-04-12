const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  const { message } = req.body;
  res.json({ reply: `Received: ${message}. Chatbot logic will be added later.` });
});

module.exports = router;