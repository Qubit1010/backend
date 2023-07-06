const mongoose = require("mongoose");

// Database Name
// const dbName = 'task-manager';

const connectDB = async () => {
  // Use connect method to connect to the server
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;