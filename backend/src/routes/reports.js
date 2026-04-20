const express = require('express');
const { getReports, createReport, getReport, deleteReport } = require('../controllers/reports');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getReports)
  .post(createReport);

router.route('/:id')
  .get(getReport)
  .delete(deleteReport);

module.exports = router;
