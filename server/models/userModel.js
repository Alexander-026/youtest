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
    friendRequests: {
      type: [
        {
          userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // ID пользователя, который отправил запрос
          requestDate: { type: Date, default: Date.now }, // Дата запроса
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
