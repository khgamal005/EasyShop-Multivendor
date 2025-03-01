const mongoose = require("mongoose")

const connectDB = () => {
    mongoose
      .connect(process.env.MONGODB_URI)
      .then((data) => {
        console.log(`mongod connected with server: ${data.connection.host}`);
      })
      .catch((err) => {
        console.error(`Database Error: ${err}`);
        process.exit(1);
      });
  };

module.exports = connectDB
