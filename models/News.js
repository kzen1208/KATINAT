const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  summary: { type: String, required: true },
  image: { type: String },
  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  },
  category: { 
    type: String, 
    enum: ['promotion', 'event', 'announcement', 'blog'],
    default: 'announcement'
  },
  tags: [{ type: String }],
  published: { type: Boolean, default: true },
  publishDate: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('News', newsSchema);