// app.js
const express = require("express");
const ErrorHandler = require("./middleware/error");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const connectDatabase = require("./db/Database");
const morgan = require("morgan");
const globalError = require("./middleware/errorMiddleware");
const ApiError = require("./utils/ErrorHandler");
const cors = require("cors");

require("dotenv").config({
  path: "./config/.env",
});

// Connect to DB
connectDatabase();

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend URL in production
    credentials: true,
  })
);

// Routes
const mountRoutes = require("./routes");
mountRoutes(app);

// 404 handler
app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

// Global error handler
app.use(globalError);
app.use(ErrorHandler);

module.exports = app;
