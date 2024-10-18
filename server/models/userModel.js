import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    birthDate: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    image: { type: String, default: "" },
    notifications: {
      type: [
        {
          userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          image: { type: String, default: "" },
          label: {type: String, require: true},
          message: {type: String, require: true},
          contact: {type: Boolean, default: false},
          requestDate: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
    friends: {
      type: [
        {
          userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // ID друга
          requestDate: { type: Date, default: Date.now }, // Дата запроса
        },
      ],
      default: [], // По умолчанию friends — это пустой массив
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
