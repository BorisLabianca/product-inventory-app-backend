const express = require("express");
const {
  registerUser,
  loginUser,
  logout,
  getUser,
  isLoggedIn,
  updateUser,
  changePassword,
} = require("../controllers/userControllers");
const isAuthenticated = require("../middlewares/isAuthenticated");
const router = express.Router();

// C
router.post("/register", registerUser);
router.post("/login", loginUser);

// R
router.get("/logout", logout);
router.get("/get-user", isAuthenticated, getUser);
router.get("/logged-in", isLoggedIn);

// U
router.patch("/update-user", isAuthenticated, updateUser);
router.patch("/change-password", isAuthenticated, changePassword);

// D

module.exports = router;
