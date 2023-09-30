const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const isAuthenticated = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(401);
      throw new Error("Not authorized, please log in.");
    }

    // Verify token
    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Get user ID from token
    const user = await User.findById(verifiedToken.id).select("-password");

    if (!user) {
      res.status(401);
      throw new Error("User not found.");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized, please log in.");
  }
});

module.exports = isAuthenticated;
