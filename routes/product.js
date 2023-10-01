const express = require("express");
const {
  createProduct,
  getAllProducts,
  getSingleProdcut,
  deleteProduct,
} = require("../controllers/prodcutControllers");
const isAuthenticated = require("../middlewares/isAuthenticated");
const { upload } = require("../utils/fileUpload");
createProduct;
isAuthenticated;
const router = express.Router();

// C
router.post("/create", isAuthenticated, upload.single("image"), createProduct);

// R
router.get("/all-products", isAuthenticated, getAllProducts);
router.get("/product/:id", isAuthenticated, getSingleProdcut);

// U

// D
router.delete("/delete/:id", isAuthenticated, deleteProduct);

module.exports = router;
