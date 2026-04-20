const mongoose = require('mongoose');

const searchHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  toolName: {
    type: String,
    required: [true, 'Please provide the tool name']
  },
  ipAddress: {
    type: String
  },
  ipVersion: {
    type: String,
    enum: ['IPv4', 'IPv6', 'Domain', 'Mixed', 'None'],
    default: 'None'
  },
  inputData: {
    type: mongoose.Schema.Types.Mixed
  },
  resultData: {
    type: mongoose.Schema.Types.Mixed
  }
}, { timestamps: true });

module.exports = mongoose.model('SearchHistory', searchHistorySchema);
