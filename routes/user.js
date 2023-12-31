const express = require("express");
const {
  registerUser,
  loginUser,
  logout,
  getUser,
  isLoggedIn,
  updateUser,
  changePassword,
  forgotPassword,
  resetPassword,
} = require("../controllers/userControllers");
const isAuthenticated = require("../middlewares/isAuthenticated");
const { upload } = require("../utils/fileUpload");
const router = express.Router();

// C
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);

// R
router.get("/logout", logout);
router.get("/get-user", isAuthenticated, getUser);
router.get("/logged-in", isLoggedIn);

// U
router.patch(
  "/update-user",
  isAuthenticated,
  upload.single("image"),
  updateUser
);
router.patch("/change-password", isAuthenticated, changePassword);
router.put("/reset-password/:resetToken", resetPassword);

// D

module.exports = router;
