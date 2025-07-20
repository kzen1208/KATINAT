const express = require('express');
const router = express.Router();
const Store = require('../models/Store');
const adminAuth = require('../middleware/adminAuth');

// Get all stores
router.get('/', async (req, res) => {
  try {
    const stores = await Store.find({ isActive: true });
    res.json(stores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single store
router.get('/:id', async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) return res.status(404).json({ message: 'Store not found' });
    res.json(store);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create store (admin only)
router.post('/', adminAuth, async (req, res) => {
  const store = new Store(req.body);
  
  try {
    const newStore = await store.save();
    res.status(201).json(newStore);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update store (admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) return res.status(404).json({ message: 'Store not found' });
    
    Object.assign(store, req.body);
    store.updatedAt = Date.now();
    
    const updatedStore = await store.save();
    res.json(updatedStore);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete store (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) return res.status(404).json({ message: 'Store not found' });
    
    // Soft delete by setting isActive to false
    store.isActive = false;
    store.updatedAt = Date.now();
    
    await store.save();
    res.json({ message: 'Store deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;