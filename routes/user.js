const express = require("express");
const {
  registerUser,
  loginUser,
  logout,
  getUser,
  isLoggedIn,
} = require("../controllers/userControllers");
const isAuthenticated = require("../middlewares/isAuthenticated");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/logout", logout);
router.get("/get-user", isAuthenticated, getUser);
router.get("/logged-in", isLoggedIn);

module.exports = router;
