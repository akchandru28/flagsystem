const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Organization = require('../models/Organization');
const FeatureFlag = require('../models/FeatureFlag');
const authenticate = require('../middleware/auth');

const router = express.Router();

// POST /api/admin/signup
router.post('/signup', async (req, res) => {
  try {
    const { email, password, organizationId } = req.body;

    if (!email || !password || !organizationId) {
      return res.status(400).json({ message: 'Email, password, and organization are required' });
    }

    // Verify organization exists
    const org = await Organization.findById(organizationId);
    if (!org) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    // Check duplicate email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const user = new User({ email, password, role: 'org_admin', organizationId });
    await user.save();

    res.status(201).json({ message: 'Admin account created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/admin/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email, role: 'org_admin' });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: 'org_admin',
        organizationId: user.organizationId,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      role: 'org_admin',
      organizationId: user.organizationId,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/admin/flags - Create feature flag
router.post('/flags', authenticate(['org_admin']), async (req, res) => {
  try {
    const { key, enabled, description } = req.body;
    const { organizationId } = req.user;

    if (!key || !key.trim()) {
      return res.status(400).json({ message: 'Feature key is required' });
    }

    const flag = new FeatureFlag({
      key: key.trim().toLowerCase(),
      enabled: enabled || false,
      description: description || '',
      organizationId,
    });

    await flag.save();
    res.status(201).json(flag);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Feature flag key already exists in your organization' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/admin/flags - List all flags for this org
router.get('/flags', authenticate(['org_admin']), async (req, res) => {
  try {
    const flags = await FeatureFlag.find({ organizationId: req.user.organizationId })
      .sort({ createdAt: -1 });
    res.json(flags);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/admin/flags/:id - Update flag (toggle enabled or change description)
router.put('/flags/:id', authenticate(['org_admin']), async (req, res) => {
  try {
    const { enabled, description, key } = req.body;
    const updateData = {};

    if (typeof enabled === 'boolean') updateData.enabled = enabled;
    if (description !== undefined) updateData.description = description;
    if (key !== undefined && key.trim() !== '') updateData.key = key.trim().toLowerCase();

    const flag = await FeatureFlag.findOneAndUpdate(
      { _id: req.params.id, organizationId: req.user.organizationId },
      updateData,
      { new: true }
    );

    if (!flag) {
      return res.status(404).json({ message: 'Feature flag not found' });
    }

    res.json(flag);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Feature flag key already exists in your organization' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/admin/flags/:id
router.delete('/flags/:id', authenticate(['org_admin']), async (req, res) => {
  try {
    const flag = await FeatureFlag.findOneAndDelete({
      _id: req.params.id,
      organizationId: req.user.organizationId,
    });

    if (!flag) {
      return res.status(404).json({ message: 'Feature flag not found' });
    }

    res.json({ message: 'Feature flag deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
