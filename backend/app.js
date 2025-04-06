const express = require("express");
const ErrorHandler = require("./middleware/error");
const app = express();
const cookieParser = require("cookie-parser");
const path = require('path');
const connectDatabase = require("./db/Database");
const morgan = require("morgan");
const globalError = require("./middleware/errorMiddleware");
const ApiError = require('./utils/ErrorHandler');
const cors = require("cors");


app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}
// Routes
const mountRoutes = require('./routes');
app.use(
  cors({
    origin: "http://localhost:5173", // Explicitly allow your frontend's URL
    credentials: true, // Allow credentials (cookies, auth headers, etc.)
  })
);

app.use(express.json({ limit: "10mb" }));  // Increase JSON size limit
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(express.static(path.join(__dirname, 'uploads')));



connectDatabase();
// Mount Routes
mountRoutes(app);

app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

app.use(globalError);
app.use(ErrorHandler);

module.exports = app;
