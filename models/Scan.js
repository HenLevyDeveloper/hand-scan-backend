const mongoose = require('mongoose');

const ScanSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    key: { type: String, required: true }, // S3 object key
    url: { type: String, required: true }, // Public URL for the object
    createdAt: { type: Date, default: Date.now },
  });

module.exports = mongoose.model('Scan', ScanSchema);
