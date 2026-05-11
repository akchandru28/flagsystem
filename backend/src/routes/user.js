const express = require('express');
const FeatureFlag = require('../models/FeatureFlag');
const Organization = require('../models/Organization');

const router = express.Router();

// GET /api/user/organizations - public: list orgs for dropdown
router.get('/organizations', async (req, res) => {
  try {
    const orgs = await Organization.find().select('name _id').sort({ name: 1 });
    res.json(orgs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/user/check?key=feature_key&organizationId=xxx
// Check if a feature is enabled for a given org
router.get('/check', async (req, res) => {
  try {
    const { key, organizationId } = req.query;

    if (!key || !organizationId) {
      return res.status(400).json({ message: 'Feature key and organizationId are required' });
    }

    // Verify org exists
    const org = await Organization.findById(organizationId);
    if (!org) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    const flag = await FeatureFlag.findOne({
      key: key.toLowerCase().trim(),
      organizationId,
    });

    if (!flag) {
      return res.status(404).json({
        message: `Feature "${key}" not found in organization "${org.name}"`,
        enabled: false,
      });
    }

    res.json({
      key: flag.key,
      enabled: flag.enabled,
      organization: org.name,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
