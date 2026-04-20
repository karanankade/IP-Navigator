const ErrorResponse = require('../utils/errorResponse');
const SavedReport = require('../models/SavedReport');

// @desc    Get all reports for user
// @route   GET /api/reports
// @access  Private
exports.getReports = async (req, res, next) => {
  try {
    const reports = await SavedReport.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: reports.length, data: reports });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a new report
// @route   POST /api/reports
// @access  Private
exports.createReport = async (req, res, next) => {
  try {
    req.body.userId = req.user.id;
    const report = await SavedReport.create(req.body);
    res.status(201).json({ success: true, data: report });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single report
// @route   GET /api/reports/:id
// @access  Private
exports.getReport = async (req, res, next) => {
  try {
    const report = await SavedReport.findById(req.params.id);

    if (!report) return next(new ErrorResponse('Report not found', 404));
    
    if (report.userId.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized', 401));
    }

    res.status(200).json({ success: true, data: report });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a report
// @route   DELETE /api/reports/:id
// @access  Private
exports.deleteReport = async (req, res, next) => {
  try {
    const report = await SavedReport.findById(req.params.id);

    if (!report) return next(new ErrorResponse('Report not found', 404));

    if (report.userId.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized', 401));
    }

    await report.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
