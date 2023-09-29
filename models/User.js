const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a username."],
    },
    email: {
      type: String,
      required: [true, "Please add an email address."],
      unique: true,
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please enter a valid email address.",
      ],
    },
    password: {
      type: String,
      required: true,
      minLength: [8, "Your password must be at least 8 characters long."],
      maxLength: [20, "Your password must not be longer than 20 characters."],
    },
    photo: {
      type: String,
      required: [true, "Please add a photo."],
      default:
        "https://res.cloudinary.com/dbe27rnpk/image/upload/v1695992594/avatar2_m2b8bd.png",
    },
    phone: {
      type: String,
      default: "+33",
    },
    bio: {
      type: String,
      maxLength: [250, "Your bio must not be longer than 250 characters."],
      default: "Add your bio here.",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
