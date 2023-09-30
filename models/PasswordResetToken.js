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
    expires: 1800,
    default: Date.now(),
  },
  //   createdAt: {
  //     type: Date,
  //     required: true,
  //   },
  //   expiresAt: {
  //     type: Date,
  //     required: true,
  //   },
});

const PasswordResetToken = mongoose.model(
  "PasswordResetToken",
  PasswordResetTokenSchema
);
module.exports = PasswordResetToken;
