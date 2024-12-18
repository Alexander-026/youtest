import dotenv from "dotenv";
dotenv.config();
import {
  login,
  update,
  logout,
  registration,
  refresh,
  getAllUsers,
  sendFriendRequestService,
  acceptFriendshipService,
  cancelFriendshipService,
  getUsersByIdService,
  deleteNotificationService,
  setConfirmMailerService,
  confirmEmailService,
} from "../service/user.service.js";
import { validationResult } from "express-validator";
import ApiError from "../exceptions/apiError.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

const saveCookie = (res, tokenName, token) => {
  res.cookie(tokenName, token, {
    httpOnly: true,
    // secure: process.env.NODE_ENV === "production",
    // sameSite: process.env.NODE_ENV === "production" ? "None" : 'Lax',
    secure: true,
    sameSite: "None",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

const registerUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(ApiError.BadRequest("Validierungsfehler", errors.array()));
    }
    const { firstName, lastName, email, birthDate, password, image } = req.body;
    const userData = await registration(
      firstName,
      lastName,
      birthDate,
      email,
      password,
      image
    );

    saveCookie(res, "refreshToken", userData.refreshToken);

    return res.status(201).json(userData);
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userData = await login(email, password);

    saveCookie(res, "refreshToken", userData.refreshToken);

    return res.status(201).json(userData);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const {
      id,
      firstName,
      lastName,
      birthDate,
      email,
      oldPassword,
      newPassword,
      image,
    } = req.body;
    const updatedUser = await update({
      id,
      firstName,
      lastName,
      birthDate,
      email,
      oldPassword,
      newPassword,
      image,
    });

    saveCookie(res, "refreshToken", updatedUser.refreshToken);

    return res.status(201).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

const logoutCurrentUser = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    const token = await logout(refreshToken);
    res.clearCookie("refreshToken");
    return res.status(200).json(token);
  } catch (error) {
    next(error);
  }
};

const refreshTokens = async (req, res, next) => {
  try {
    const { refreshToken: clientRefreshToken } = req.body;
    const { refreshToken } = req.cookies;
    const token = refreshToken || clientRefreshToken;
    const userData = await refresh(token);
    saveCookie(res, "refreshToken", userData.refreshToken);
    return res.status(201).json(userData);
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await getAllUsers(req);
    return res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

const sendFriendRequestController = async (req, res, next) => {
  try {
    const { myUserId, senderUserId } = req.body;
    const receiverSocketId = getReceiverSocketId(senderUserId);

    const result = await sendFriendRequestService(myUserId, senderUserId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newFriendRequest", result.result);
    }
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const acceptFriendshipController = async (req, res, next) => {
  try {
    const { myUserId, senderUserId } = req.body;
    const receiverSocketId = getReceiverSocketId(senderUserId);
    const result = await acceptFriendshipService(myUserId, senderUserId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("acceptFriendship", result.result);
    }
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
const cancelFriendshipController = async (req, res, next) => {
  try {
    const { myUserId, senderUserId } = req.body;
    const receiverSocketId = getReceiverSocketId(senderUserId);
    const result = await cancelFriendshipService(myUserId, senderUserId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("cancelFriendship", result.result);
    }
    return res.status(204).json(result);
  } catch (error) {
    next(error);
  }
};

const deleteNotificationController = async (req, res, next) => {
  try {
    const { myUserId, notificationId } = req.body;

    const result = await deleteNotificationService(myUserId, notificationId);

    return res.status(204).json(result);
  } catch (error) {
    next(error);
  }
};

const getUsersByIdController = async (req, res, next) => {
  try {
    const { userIds } = req.body;
    const result = await getUsersByIdService(userIds);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const setConfirmMailerController = async (req, res, next) => {
  try {
    const { id, email } = req.user;
    const result = await setConfirmMailerService(id, email);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const confirmEmailController = async (req, res, next) => {
  try {
    const activateId = req.params.id;
    const result = await confirmEmailService(activateId);
    console.log("result", result)
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export {
  registerUser,
  loginUser,
  updateUser,
  logoutCurrentUser,
  refreshTokens,
  getUsers,
  sendFriendRequestController,
  acceptFriendshipController,
  cancelFriendshipController,
  deleteNotificationController,
  getUsersByIdController,
  setConfirmMailerController,
  confirmEmailController,
};
