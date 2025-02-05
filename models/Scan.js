const mongoose = require('mongoose');

const ScanSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    scanUrl: String,
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Scan', ScanSchema);
