const express = require("express");
const {
  registerUser,
  loginUser,
  logout,
  getUser,
} = require("../controllers/userControllers");
const isAuthenticated = require("../middlewares/isAuthenticated");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/logout", logout);
router.get("/get-user", isAuthenticated, getUser);

module.exports = router;
