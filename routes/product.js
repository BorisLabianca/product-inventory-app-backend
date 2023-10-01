const express = require("express");
const {
  createProduct,
  getAllProducts,
  getSingleProdcut,
  deleteProduct,
  updateProduct,
} = require("../controllers/productControllers");
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
router.patch(
  "/update/:id",
  isAuthenticated,
  upload.single("image"),
  updateProduct
);
// D
router.delete("/delete/:id", isAuthenticated, deleteProduct);

module.exports = router;
