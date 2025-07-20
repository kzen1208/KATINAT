const express = require('express');
const router = express.Router();
const News = require('../models/News');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Get all news
router.get('/', async (req, res) => {
  try {
    const { category, tag } = req.query;
    let query = { published: true };
    
    if (category) query.category = category;
    if (tag) query.tags = tag;
    
    const news = await News.find(query)
      .populate('author', 'name')
      .sort({ publishDate: -1 });
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all news (including unpublished) - admin only
router.get('/all', adminAuth, async (req, res) => {
  try {
    const news = await News.find()
      .populate('author', 'name')
      .sort({ createdAt: -1 });
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single news
router.get('/:id', async (req, res) => {
  try {
    const news = await News.findById(req.params.id)
      .populate('author', 'name');
    
    if (!news) return res.status(404).json({ message: 'News not found' });
    
    // If news is not published and user is not admin, don't show
    if (!news.published && (!req.user || req.user.role !== 'admin')) {
      return res.status(404).json({ message: 'News not found' });
    }
    
    res.json(news);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create news (admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const news = new News({
      ...req.body,
      author: req.user.id
    });
    
    const newNews = await news.save();
    res.status(201).json(newNews);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update news (admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ message: 'News not found' });
    
    Object.assign(news, req.body);
    news.updatedAt = Date.now();
    
    const updatedNews = await news.save();
    res.json(updatedNews);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete news (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ message: 'News not found' });
    
    await news.remove();
    res.json({ message: 'News deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;