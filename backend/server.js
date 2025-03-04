const express = require("express");
const path = require('path');
const connectDatabase = require("./db/Database");
const morgan = require("morgan");
const globalError = require("./middleware/errorMiddleware");
const ApiError = require('./utils/ErrorHandler');
const cors = require("cors");

if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "config/.env" });
}

const app = express();

// Remove these redundant calls:
// app.use(cors());
// app.options('*', cors());

app.use(
  cors({
    origin: "http://localhost:5173", // Explicitly allow your frontend's URL
    credentials: true, // Allow credentials (cookies, auth headers, etc.)
  })
);

app.use(express.json({ limit: "10mb" }));  // Increase JSON size limit
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(express.static(path.join(__dirname, 'uploads')));

const userRoute = require("./routes/userRoute");

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

connectDatabase();

app.use('/api/v1/user', userRoute);

app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

app.use(globalError);

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log(`Shutting down the server for ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});
