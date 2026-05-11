const express = require('express');
const jwt = require('jsonwebtoken');
const Organization = require('../models/Organization');
const authenticate = require('../middleware/auth');

const router = express.Router();

// POST /api/super-admin/login
// Super admin uses static credentials from .env
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  if (
    email !== process.env.SUPER_ADMIN_EMAIL ||
    password !== process.env.SUPER_ADMIN_PASSWORD
  ) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { role: 'super_admin', email },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  res.json({ token, role: 'super_admin', email });
});

// POST /api/super-admin/organizations
// Create a new organization
router.post('/organizations', authenticate(['super_admin']), async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Organization name is required' });
    }

    const org = new Organization({ name: name.trim() });
    await org.save();

    res.status(201).json(org);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Organization name already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/super-admin/organizations
// List all organizations
router.get('/organizations', authenticate(['super_admin']), async (req, res) => {
  try {
    const orgs = await Organization.find().sort({ createdAt: -1 });
    res.json(orgs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
