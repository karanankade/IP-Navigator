const mongoose = require('mongoose');

const savedReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a report title']
  },
  toolName: {
    type: String,
    required: [true, 'Please provide the tool name']
  },
  inputData: {
    type: mongoose.Schema.Types.Mixed
  },
  resultData: {
    type: mongoose.Schema.Types.Mixed
  }
}, { timestamps: true });

module.exports = mongoose.model('SavedReport', savedReportSchema);
