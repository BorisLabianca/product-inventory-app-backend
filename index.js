const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/connectDB");
require("dotenv").config();
const errorHandler = require("./middlewares/errorMiddleware");

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyParser.json());

// Routes imports
const userRoutes = require("./routes/user");

// Routes
app.use("/api/users", userRoutes);

app.all("*", (req, res) => {
  res.status(500).json({ message: "This page doesn't exist." });
});

// Error middleware
app.use(errorHandler);
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
