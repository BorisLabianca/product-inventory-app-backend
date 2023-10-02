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
      publicId: uploadedFile.public_id,
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

const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ user: req.user._id }).sort(
    "-createdAt"
  );
  res.status(200).json(products);
});

const getSingleProdcut = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found.");
  }
  if (product.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("User not owner of this product.");
  }

  res.status(200).json(product);
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found.");
  }
  if (product.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error(
      "User not owner of this product. Cannot delete this product."
    );
  }

  if (product.image && Object.keys(product.image).length !== 0) {
    await cloudinary.uploader.destroy(product.image.publicId);
  }

  await product.deleteOne();

  res.status(200).json({ message: "Product successfully deleted." });
});

const updateProduct = asyncHandler(async (req, res) => {
  const { name, category, quantity, price, description } = req.body;
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found.");
  }
  if (product.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error(
      "User not owner of this product. Cannot delete this product."
    );
  }

  if (product.image && Object.keys(product.image).length !== 0) {
    await cloudinary.uploader.destroy(product.image.publicId);
  }

  let fileData = {};
  if (req.file) {
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
      publicId: uploadedFile.public_id,
    };
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    { _id: id },
    {
      name,
      category,
      quantity,
      price,
      description,
      image: Object.keys(fileData).length === 0 ? product?.image : fileData,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json(updatedProduct);
});

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProdcut,
  deleteProduct,
  updateProduct,
};
