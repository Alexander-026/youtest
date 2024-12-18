import dotenv from "dotenv";
dotenv.config();
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  findToken,
  generateTokens,
  removeToken,
  removeTokenById,
  saveToken,
  validateRefreshToken,
} from "./token.service.js";
import userDto from "../dtos/userDto.js";
import ApiError from "../exceptions/apiError.js";
import mongoose from "mongoose";
import { transporter } from "../controllers/contact.controller.js";

const registration = async (
  firstName,
  lastName,
  birthDate,
  email,
  password,
  image
) => {
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw ApiError.BadRequest(
      `Benutzer mit E-Mail-Adresse ${email} existiert bereits`
    );
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    firstName,
    lastName,
    email,
    birthDate,
    password: hashedPassword,
    image,
  });
  const newUser = userDto(user);
  newUser.wasOnline = user.wasOnline;
  const tokens = generateTokens({ ...newUser });
  await saveToken(newUser.id, tokens.refreshToken);

  return { ...tokens, user: newUser };
};

const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw ApiError.BadRequest(`Passwort oder E-Mail wurden falsch eingegeben`);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw ApiError.BadRequest(`Passwort oder E-Mail wurden falsch eingegeben`);
  }

  const newUser = userDto(user);
  newUser.wasOnline = user.wasOnline;
  const tokens = generateTokens({ ...newUser });
  await saveToken(newUser.id, tokens.refreshToken);
  await removeToken();
  return { ...tokens, user: newUser };
};

const update = async (user) => {
  const {
    id,
    firstName,
    lastName,
    birthDate,
    email,
    oldPassword,
    newPassword,
    image,
  } = user;
  const userFromData = await User.findById(id);
  if (!userFromData) {
    throw ApiError.BadRequest(`User not found`);
  }
  if (email !== userFromData.email) {
    const userExists = await User.findOne({ email });
    if (userExists) {
      throw ApiError.BadRequest(
        `User with email address ${email} already exists`
      );
    }
    userFromData.emailStatus = "unconfirmed"
  }

  let hashedPassword = null;

  if (newPassword && oldPassword && newPassword !== oldPassword) {
    const isPasswordValid = await bcrypt.compare(
      oldPassword,
      userFromData.password
    );
    if (!isPasswordValid) {
      throw ApiError.BadRequest(`The old password is incorrect`);
    }
    const salt = await bcrypt.genSalt(10);
    hashedPassword = await bcrypt.hash(newPassword, salt);
  }

  userFromData.firstName = firstName;
  userFromData.lastName = lastName;
  userFromData.birthDate = birthDate;
  userFromData.email = email;
  userFromData.image = image;
  userFromData.password = hashedPassword || userFromData.password;

  const savedUser = await userFromData.save();
  const newUser = userDto(savedUser);
  const tokens = generateTokens({ ...newUser });
  await removeTokenById(id);
  await saveToken(newUser.id, tokens.refreshToken);
  return { ...tokens, user: newUser };
};

const logout = async (refreshToken) => {
  const decodedUser = await jwt.decode(refreshToken);
  if (!decodedUser) {
    throw ApiError.BadRequest(`User not found`);
  }

  const user = await User.findById(decodedUser.user.id);

  user.wasOnline = Date.now();
  await user.save();

  const token = await removeToken(refreshToken);
  return token;
};

const refresh = async (refreshToken) => {
  if (!refreshToken) {
    throw ApiError.UnauthorizedError();
  }

  console.log("refreshed")

  const userData = validateRefreshToken(refreshToken);
  const tokenFromDB = await findToken(refreshToken);

  if (!userData || !tokenFromDB) {
    throw ApiError.InvalidRefreshToken();
  }

  const user = await User.findById(userData.user.id);
  user.wasOnline = Date.now();
  await user.save();

  const newUser = userDto(user);
  const tokens = generateTokens({ ...newUser });
  await saveToken(newUser.id, tokens.refreshToken);

  return { ...tokens, user: newUser };
};

const getAllUsers = async (req) => {
  const loggedInUserId = new mongoose.Types.ObjectId(`${req.user.id}`);
  const users = await User.aggregate([
    {
      $match: { _id: { $ne: loggedInUserId } }, // исключаем текущего пользователя
    },
    {
      $project: {
        firstName: 1,
        lastName: 1,
        email: 1,
        birthDate: 1,
        isAdmin: 1,
        image: 1,
        notifications: 1,
        friends: 1,
        id: "$_id", // создаем поле `id`, равное `_id`
        _id: 0, // исключаем поле `_id`
      },
    },
  ]);

  return users;
};

const sendFriendRequestService = async (myUserId, senderUserId) => {
  const myData = await User.findById(myUserId);
  const senderData = await User.findById(senderUserId);
  if (!myData || !senderData) {
    throw ApiError.NotFound("User or Sender not Found !");
  }

  // Проверяем, не отправлен ли запрос ранее
  const alreadyRequested = senderData.notifications.some(
    (request) => request.userId.toString() === myUserId && request.contact
  );
  const alreadyFriend = senderData.friends.some(
    (request) => request.userId.toString() === myUserId
  );
  if (alreadyRequested) {
    throw ApiError.Conflict("The request has already been sent!");
  }
  if (alreadyFriend) {
    throw ApiError.Conflict("Already friends!");
  }
  // Добавляем запрос в массив notifications
  senderData.notifications.unshift({
    userId: myUserId,
    image: myData.image,
    label: `${myData.firstName} ${myData.lastName}`,
    message: "Wants to be friends with you",
    contact: true,
  });

  const result = senderData.notifications[0];
  // Сохраняем изменения
  await senderData.save();

  return { success: true, message: "Запрос в друзья отправлен", result };
};

const acceptFriendshipService = async (myUserId, senderUserId) => {
  const myData = await User.findById(myUserId);
  const senderData = await User.findById(senderUserId);
  if (!myData || !senderData) {
    throw ApiError.NotFound("User or Sender not Found !");
  }

  const alreadyRequested = myData.notifications.some(
    (request) => request.userId.toString() === senderUserId
  );

  if (!alreadyRequested) {
    throw ApiError.Conflict("Sender not found!");
  }
  myData.notifications = myData.notifications.filter(
    (request) => request.userId.toString() !== senderUserId
  );
  myData.friends.push({ userId: senderUserId });
  senderData.notifications.unshift({
    userId: myUserId,
    image: myData.image,
    label: `${myData.firstName} ${myData.lastName}`,
    message: "Request accepted! We're now friends 😊",
  });
  const result = senderData.notifications[0];
  senderData.friends.unshift({ userId: myUserId });
  await myData.save();
  await senderData.save();
  return {
    success: true,
    message: `${senderData.firstName} ${senderData.lastName} now your friend`,
    result,
  };
};

const cancelFriendshipService = async (myUserId, senderUserId) => {
  const myData = await User.findById(myUserId);
  const senderData = await User.findById(senderUserId);
  if (!myData || !senderData) {
    throw ApiError.NotFound("User or Sender not Found !");
  }
  const alreadyRequested = myData.notifications.some(
    (request) => request.userId.toString() === senderUserId
  );

  const alreadyFriend = myData.friends.some(
    (request) => request.userId.toString() === senderUserId
  );

  if (!alreadyRequested && !alreadyFriend) {
    throw ApiError.Conflict("Sender not found!");
  }
  myData.notifications = myData.notifications.filter(
    (request) => request.userId.toString() !== senderUserId
  );
  myData.friends = myData.friends.filter(
    (request) => request.userId.toString() !== senderUserId
  );

  senderData.notifications = senderData.notifications.filter(
    (request) => request.userId.toString() !== myUserId
  );

  senderData.friends = senderData.friends.filter(
    (request) => request.userId.toString() !== myUserId
  );

  senderData.notifications.unshift({
    userId: myUserId,
    image: myData.image,
    label: `${myData.firstName} ${myData.lastName}`,
    message: "cancelled friendship",
  });

  const result = senderData.notifications[0];

  await myData.save();
  await senderData.save();
  const canceledFriedship = `You have cancelled your friendship with ${senderData.firstName} ${senderData.lastName}`;
  const removedFromFriends = `${senderData.firstName} ${senderData.lastName} was removed from friends`;
  return {
    success: true,
    message: alreadyFriend ? removedFromFriends : canceledFriedship,
    result,
  };
};

const deleteNotificationService = async (myUserId, notificationId) => {
  const myData = await User.findById(myUserId);

  if (!myData) {
    throw ApiError.NotFound("User or Sender not Found !");
  }

  myData.notifications = myData.notifications.filter(
    (n) => n._id.toString() !== notificationId
  );
  await myData.save();
  return {
    success: true,
    message: "The notification has been removed.",
  };
};

const getUsersByIdService = async (userIds) => {
  // Ищем пользователей, у которых _id находится в массиве userIds
  const users = await User.find({
    _id: { $in: userIds }, // Оператор $in для поиска по массиву ID
  })
    .select("firstName lastName image")
    .lean();

  const usersWithId = users.map((user) => {
    return { ...user, id: user._id, _id: undefined };
  });

  return usersWithId;
};

const setConfirmMailerService = async (id, myEmail) => {
  const user = await User.findById(id);
  if (!user) {
    throw ApiError.BadRequest(`Activator not found`);
  }
  const link = `${process.env.CLIENT_ORIGIN}/activated/${id}`;

  user.emailStatus = "pending";
  const mailOptions = {
    from: process.env.SMTP_USER,
    to:myEmail,
    subject: "Confirm Your Email Address",
    text: "",
    html: `
        <div>
           <h1>Confirm Your Email</h1>
            <a href="${link}">Confirm</a>
        </div>
      `,
  };
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        reject(ApiError.BadRequest("Error sending message"));
      } else {
        try {
          await user.save(); // Сохраняем обновленный статус пользователя
          console.log("Email sent: " + info.response);
          resolve({ message: "Confirmation email sent successfully." });
        } catch (saveError) {
          console.error("Error saving user:", saveError);
          reject(ApiError.BadRequest("Error saving user data"));
        }
      }
    });
  });
};

const confirmEmailService = async (activateId) => {
  const user = await User.findById(activateId);
  if (!user) {
    throw ApiError.BadRequest(`Activator not found`);
  }

  if(user.emailStatus === "confirmed") {
    throw ApiError.BadRequest(`already confirmed`);
  }

  user.emailStatus = "confirmed";
  const savedUser = await user.save();
  const activatedUser = userDto(savedUser);
  const emailStatus = activatedUser.emailStatus

  return {emailStatus};
};

export {
  registration,
  login,
  update,
  logout,
  refresh,
  getAllUsers,
  sendFriendRequestService,
  acceptFriendshipService,
  cancelFriendshipService,
  deleteNotificationService,
  getUsersByIdService,
  setConfirmMailerService,
  confirmEmailService,
};
