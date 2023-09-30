const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const crypto = require("crypto");
const PasswordResetToken = require("../models/PasswordResetToken");
const sendEmail = require("../utils/sendEmail");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please make sure to fill out all fileds.");
  }
  if (password.length < 8) {
    res.status(400);
    throw new Error("Your password must be at least 8 characters long.");
  }

  //   Check if email is already used
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(404);
    throw new Error("Email addresse already in use.");
  }

  //   Encrypt password
  //   const salt = await bcrypt.genSalt(15);
  //   const hashedPassword = await bcrypt.hash(password, salt);

  //   Create new user
  const user = await User.create({
    name,
    email,
    password,
  });

  // Generate token
  const token = generateToken(user._id);

  //   Send http only cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400),
    sameSite: "none",
    secure: true,
  });

  if (user) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(201).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
      token,
    });
  } else {
    res.status(400);
    throw new Error("User not created.");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //   Validate request
  if (!email || !password) {
    res.status(400);
    throw new Error("Make sure to send both email and password.");
  }

  //   Check if user exists
  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error("User not found, please try a different email address.");
  }

  //   Check if password is correct
  const passwordIsCorrect = await bcrypt.compare(password, user.password);

  // Generate token
  const token = generateToken(user._id);

  if (passwordIsCorrect) {
    //   Send http only cookie
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400),
      sameSite: "none",
      secure: true,
    });
  }

  if (user && passwordIsCorrect) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(200).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid email or password.");
  }
});

const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true,
  });
  return res.status(200).json({ message: "You've successfully logged out." });
});

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(200).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
    });
  } else {
    res.status(400);
    throw new Error("Not authorized, please log in.");
  }
});

const isLoggedIn = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json(false);
  }

  const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
  if (verifiedToken) {
    return res.json(true);
  } else {
    return res.json(false);
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { name, email, photo, phone, bio } = user;
    user.email = email;
    user.name = req.body.name || name;
    user.photo = req.body.photo || photo;
    user.phone = req.body.phone || phone;
    user.bio = req.body.bio || bio;

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      photo: updatedUser.photo,
      phone: updatedUser.phone,
      bio: updatedUser.bio,
    });
  } else {
    res.status(404);
    throw new Error("User not found.");
  }
});

const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  const { oldPassword, newPassword } = req.body;

  // Validation
  if (!user) {
    res.status(404);
    throw new Error("User not found. Please log in.");
  }

  if (!oldPassword || !newPassword) {
    res.status(400);
    throw new Error("Please add old and new password.");
  }

  if (newPassword.length < 8) {
    res.status(400);
    throw new Error("Your password must be at least 8 characters long.");
  }

  if (oldPassword === newPassword) {
    res.status(400);
    throw new Error("Your new password must be different from the old one.");
  }

  // Checking old password is correct
  const oldPasswordIsCorrect = await bcrypt.compare(oldPassword, user.password);

  if (user && oldPasswordIsCorrect) {
    user.password = newPassword;

    await user.save();
    res.status(200).send("Password changed successfully.");
  } else {
    res.status(400);
    throw new Error("Old password incorrect.");
  }
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User does not exist. Please try again.");
  }

  // Delete reset token if it exists in DB
  let token = await PasswordResetToken.findOne({ userId: user._id });
  if (token) {
    await PasswordResetToken.deleteOne();
  }

  // Create reset token
  let resetToken = crypto.randomBytes(32).toString("hex") + user._id;

  // Hash token
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Save token to DB
  await new PasswordResetToken({
    userId: user._id,
    token: hashedToken,
    // createdAt: Date.now(),
    // expiresAt: Date.now() + 30 * (60 * 1000),
  }).save();

  // Reset URL
  const resetUrl = `${process.env.FRONT_END_URL}/resetpassword/${resetToken}`;

  // Reset Email
  const message = `<h2>Hello ${user.name}</h2>
  <p>Please use the url below to reset your password.</p>
  <p>This reset link is only valid for 30 minutes.</p>
  <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
  <p>Regards.</p>
  <p>PInvent team.</P>
  `;

  const subject = "Password reset request";
  const sendTo = user.email;
  const sentFrom = process.env.EMAIL_USER;

  try {
    await sendEmail(subject, message, sendTo, sentFrom);
    res.status(200).json({
      success: true,
      message: "A reset email has been sent to your email address.",
    });
  } catch (error) {
    res.status(500);
    throw new Error("Email not sent, please try again.");
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { resetToken } = req.params;

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const savedToken = await PasswordResetToken.findOne({
    token: hashedToken,
    expiresAt: { $gt: Date.now() },
  });

  if (!savedToken) {
    res.status(4044);
    throw new Error("Invalid or expired token.");
  }

  const user = await User.findOne({ _id: savedToken.userId });
  user.password = password;

  await user.save();
  res
    .status(200)
    .json({ message: "Password reset successfully. Please log in." });
});

module.exports = {
  registerUser,
  loginUser,
  logout,
  getUser,
  isLoggedIn,
  updateUser,
  changePassword,
  forgotPassword,
  resetPassword,
};
