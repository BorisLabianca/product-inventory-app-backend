const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

const contactUs = asyncHandler(async (req, res) => {
  const { subject, message } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(400);
    throw new Error("User not found. Please sign up.");
  }

  if (!subject || !message) {
    res.status(400);
    throw new Error("Please add a subject and a message.");
  }

  const sendTo = process.env.EMAIL_USER;
  const sentFrom = process.env.EMAIL_USER;
  const replyTo = user.email;

  try {
    await sendEmail(subject, message, sendTo, sentFrom, replyTo);
    res.status(200).json({
      success: true,
      message: "Your message has been sent. Thank you for contacting us.",
    });
  } catch (error) {
    res.status(500);
    throw new Error("Message not sent, please try again.");
  }
});

module.exports = { contactUs };
