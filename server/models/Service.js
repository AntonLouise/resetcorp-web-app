const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  features: [{
    type: String
  }],
  icon: {
    type: String,
    default: 'build'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  whyChoose: [{
    type: String
  }],
  ctaText: {
    type: String,
    default: ''
  },
  ctaButtonText: {
    type: String,
    default: 'Contact Us'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Service', serviceSchema); 