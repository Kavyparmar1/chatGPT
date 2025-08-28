const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connect database");
  } catch (error) {
    console.log("disconnect with database", error);
  }
} 

module.exports = connectDB;