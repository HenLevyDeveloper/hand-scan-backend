const mongoose = require("mongoose");

const ScanSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  key: { type: String, required: true },
  url: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Convert `_id` to `id` automatically when returning JSON
ScanSchema.set("toJSON", {
  virtuals: true, 
  versionKey: false, 
  transform: function (doc, ret) {
    ret.id = ret._id.toString(); // Convert `_id` to string and rename
    delete ret._id; // Remove `_id`
  },
});

module.exports = mongoose.model("Scan", ScanSchema);
