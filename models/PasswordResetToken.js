const mongoose = require("mongoose");

const PasswordResetTokenSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

const PasswordResetToken = model.model(
  "PasswordResetToken",
  PasswordResetTokenSchema
);
module.exports = PasswordResetToken;
