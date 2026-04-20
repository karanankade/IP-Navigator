const express = require('express');
const { getHistory, deleteHistory, clearHistory } = require('../controllers/history');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getHistory)
  .delete(clearHistory);

router.route('/:id')
  .delete(deleteHistory);

module.exports = router;
