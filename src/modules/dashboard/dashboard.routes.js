const express = require('express');
const auth = require('../../middleware/auth');
const controller = require('./dashboard.controller');

const router = express.Router();

router.use(auth);

router.get('/summary', controller.summaryHandler);
router.get('/by-category', controller.byCategoryHandler);
router.get('/trends', controller.trendsHandler);
router.get('/recent', controller.recentHandler);

module.exports = router;