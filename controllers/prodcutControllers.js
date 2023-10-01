const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");
const { fileSizeFormatter } = require("../utils/fileUpload");
const cloudinary = require("../cloudinary/index");
const createProduct = asyncHandler(async (req, res) => {
  const { name, sku, category, quantity, price, description } = req.body;

  // Validation
  if (!name || !sku || !category || !quantity || !price || !description) {
    res.status(400);
    throw new Error("Please, make sure to fill out all the fields.");
  }

  // Handle file upload
  let fileData = {};
  if (req.file) {
    console.log(req.file);
    let uploadedFile;
    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "product-inventory-app",
        resource_type: "image",
      });
    } catch (error) {
      res.status(500);
      throw new Error("Image couldn't be uploaded.");
    }
    fileData = {
      fileName: req.file.originalname,
      filePath: uploadedFile.secure_url,
      fileType: req.file.mimetype,
      fileSize: fileSizeFormatter(req.file.size, 2),
    };
  }

  // Create Product
  const product = await Product.create({
    user: req.user._id,
    name,
    sku,
    category,
    quantity,
    price,
    description,
    image: fileData,
  });

  res.status(201).json(product);
});

module.exports = { createProduct };
