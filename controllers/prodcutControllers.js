const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");

const createProduct = asyncHandler(async (req, res) => {
  const { name, sku, category, quantity, price, description } = req.body;

  //   Valifdation
  if (!name || !sku || !category || !quantity || !price || !description) {
    res.status(400);
    throw new Error("Please, make sure to fill out all the fields.");
  }

  //   Create Product
  const product = await Product.create({
    user: req.user._id,
    name,
    sku,
    category,
    quantity,
    price,
    description,
  });

  res.status(201).json(product);
});

module.exports = { createProduct };