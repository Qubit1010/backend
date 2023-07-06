const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      //   trim: true,
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      // trim: true,
      // lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      //   trim: true,
      //   minlength: 7,
    },
    image: {
      type: String,
      required: [true, "Please add an image"],
    },
    places: [
      { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Place" },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
