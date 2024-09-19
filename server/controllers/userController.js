import {
  login,
  update,
  logout,
  registration,
  refresh,
  getAllUsers,
} from "../service/userService.js";
import { validationResult } from "express-validator";
import ApiError from "../exceptions/apiError.js";

const saveCookie = (res, tokenName, token) => {
  res.cookie(tokenName, token, {
    httpOnly: true,
    // secure: process.env.NODE_ENV === "production",
    // sameSite: process.env.NODE_ENV === "production" ? "None" : 'Lax',
    secure: true,
    sameSite: "None",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
}

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

    saveCookie(res,"refreshToken", userData.refreshToken)

    return res.status(201).json(userData);
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userData = await login(email, password);

    saveCookie(res,"refreshToken", userData.refreshToken)

    return res.status(201).json(userData);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id, firstName, lastName, birthDate, email, oldPassword, newPassword, image } = req.body;
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

    saveCookie(res,"refreshToken", userData.refreshToken)
    

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
    return res.json(token);
  } catch (error) {
    next(error);
  }
};

const refreshTokens = async (req, res, next) => {
  try {
    const { refreshToken: clientRefreshToken } = req.body
    const { refreshToken } = req.cookies;
    const token =  refreshToken || clientRefreshToken 
    const userData = await refresh(token);
    saveCookie(res,"refreshToken", userData.refreshToken)
    return res.status(201).json(userData);
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await getAllUsers();
    return res.json(users);
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
};
