const express = require("express");
const { createProduct } = require("../controllers/prodcutControllers");
const isAuthenticated = require("../middlewares/isAuthenticated");
const { upload } = require("../utils/fileUpload");
createProduct;
isAuthenticated;
const router = express.Router();

// C
router.post("/create", isAuthenticated, upload.single("image"), createProduct);

// R

// U

// D

module.exports = router;
