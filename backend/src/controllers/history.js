const ErrorResponse = require('../utils/errorResponse');
const SearchHistory = require('../models/SearchHistory');

// @desc    Get all search history for user
// @route   GET /api/history
// @access  Private
exports.getHistory = async (req, res, next) => {
  try {
    const history = await SearchHistory.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: history.length, data: history });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a search history
// @route   DELETE /api/history/:id
// @access  Private
exports.deleteHistory = async (req, res, next) => {
  try {
    const history = await SearchHistory.findById(req.params.id);

    if (!history) {
      return next(new ErrorResponse('History note found', 404));
    }

    if (history.userId.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to delete this history', 401));
    }

    await history.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};

// @desc    Clear all user history
// @route   DELETE /api/history
// @access  Private
exports.clearHistory = async (req, res, next) => {
  try {
    await SearchHistory.deleteMany({ userId: req.user.id });
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
