const express = require('express');
const router = express.Router();
const { generateSummary } = require('../controllers/ai.controller');
const { auth } = require('../middleware/auth.middleware');

// All AI routes are protected
router.use(auth);

router.post('/generate-summary', generateSummary);

module.exports = router;
