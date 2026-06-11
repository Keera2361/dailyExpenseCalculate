const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jti: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  lastActiveAt: { type: Date, default: Date.now },
  ip: String,
  userAgent: String,
  revoked: { type: Boolean, default: false }
});

module.exports = mongoose.model('Session', sessionSchema);
