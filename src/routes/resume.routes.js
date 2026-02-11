const express = require('express');
const router = express.Router();
const {
    createResume,
    getResumes,
    getResume,
    updateResume,
    deleteResume,
} = require('../controllers/resume.controller');
const { auth } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const {
    createResumeSchema,
    updateResumeSchema,
} = require('../validators/resume.validator');

// All resume routes are protected
router.use(auth);

router
    .route('/')
    .get(getResumes)
    .post(validate(createResumeSchema), createResume);

router
    .route('/:id')
    .get(getResume)
    .put(validate(updateResumeSchema), updateResume)
    .delete(deleteResume);

module.exports = router;
