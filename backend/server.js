<<<<<<< HEAD
const express = require("express");
const path = require('path');
const connectDatabase = require("./db/Database");
// const cloudinary = require("cloudinary");
;const morgan = require("morgan");
// const mountRoutes = require('./routes');
// Handling uncaught Exception
const globalError = require("./middleware/errorMiddleware");
const ApiError = require('./utils/ErrorHandler');
const cors = require("cors");

=======
>>>>>>> origin/main


if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "config/.env" });
}
const app = express();


app.use(cors());

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'uploads')));


const userRoute=require("./routes/userRoute");


if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}


<<<<<<< HEAD
connectDatabase();

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// })
app.use('/api/v1/user', userRoute);
=======

const app = require("./app");

>>>>>>> origin/main

// Mount Routes
// mountRoutes(app);

app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

<<<<<<< HEAD
// create server
app.use(globalError);
=======
>>>>>>> origin/main
const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log(`Shutting down the server for ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});
