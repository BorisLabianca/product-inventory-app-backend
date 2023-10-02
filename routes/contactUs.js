const express = require("express");
const isAuthenticated = require("../middlewares/isAuthenticated");
const { contactUs } = require("../controllers/contactUsController");

const router = express.Router();

// C
router.post("/", isAuthenticated, contactUs);

// R

// U

// D

module.exports = router;
