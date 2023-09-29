const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

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

module.exports = { registerUser };
