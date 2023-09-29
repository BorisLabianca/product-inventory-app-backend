const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/connectDB");
require("dotenv").config();

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyParser.json());

// Routes
app.get("/api/", (req, res) => {
  res.send("This is the home page.");
});

app.all("*", (req, res) => {
  res.status(500).json({ message: "This page doesn't exist." });
});

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
