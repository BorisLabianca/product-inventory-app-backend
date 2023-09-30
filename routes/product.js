const express = require("express");
const { createProduct } = require("../controllers/prodcutControllers");
const isAuthenticated = require("../middlewares/isAuthenticated");
createProduct;
isAuthenticated;
const router = express.Router();

// C
router.post("/create", isAuthenticated, createProduct);

// R

// U

// D

module.exports = router;
