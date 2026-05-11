const mongoose = require('mongoose');

const featureFlagSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: [true, 'Feature key is required'],
      trim: true,
      lowercase: true,
    },
    enabled: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
  },
  { timestamps: true }
);

// Compound unique index: same key can't repeat within same org
featureFlagSchema.index({ key: 1, organizationId: 1 }, { unique: true });

module.exports = mongoose.model('FeatureFlag', featureFlagSchema);
