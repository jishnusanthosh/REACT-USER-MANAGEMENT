const mongoose = require("mongoose");

mongoose
  .connect("mongodb+srv://jishnuvs:jishnuvs123@reactfirstproject.fml5yoi.mongodb.net/React-First-Project")
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });

module.exports = mongoose;
