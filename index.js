const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/connectDB");
require("dotenv").config();

const app = express();

const startServer = async () => {
  try {
    await connectDB();
    app.listen(process.env.PORT, (req, res) => {
      console.log(`Server started on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
