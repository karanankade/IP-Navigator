const mongoose = require('mongoose');

const favoriteToolSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  toolName: {
    type: String,
    required: [true, 'Please provide the tool name']
  }
}, { timestamps: true });

module.exports = mongoose.model('FavoriteTool', favoriteToolSchema);
