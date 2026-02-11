const express = require('express');
const router = express.Router();
const { generateSummary, analyzeResume } = require('../controllers/ai.controller');
const { auth } = require('../middleware/auth.middleware');

// All AI routes are protected
router.use(auth);

router.post('/generate-summary', generateSummary);
router.post('/analyze', analyzeResume);

module.exports = router;
