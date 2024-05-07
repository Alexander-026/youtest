import jwt from "jsonwebtoken";
import Token from "../models/tokenModel.js";

const generateTokens = (user) => {
  const accessToken = jwt.sign({ user }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "24h",
  });
  const refreshToken = jwt.sign({ user }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "14d",
  });

  return {
    accessToken,
    refreshToken,
  };
};

const validateAccessToken = (token) => {
  try {
    const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    return userData;
  } catch (error) {
    return null;
  }
};
const validateRefreshToken = (token) => {
  try {
    const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    return userData;
  } catch (error) {
    return null;
  }
};

const saveToken = async (userId, refreshToken) => {
  const tokenData = await Token.findOne({ user: userId });

  if (tokenData) {
    tokenData.refreshToken = refreshToken;
    return tokenData.save();
  }

  const token = await Token.create({ user: userId, refreshToken });
  return token;
};

const removeToken = async (refreshToken) => {
  const tokenData = await Token.deleteOne({ refreshToken });
  return tokenData;
};

const removeTokenById = async (userID) => {
  const tokenData = await Token.deleteOne({ user: userID });
  return tokenData;
};

const findToken = async (refreshToken) => {
  const tokenData = await Token.findOne({ refreshToken });
  return tokenData;
};

export {
  generateTokens,
  saveToken,
  removeToken,
  removeTokenById,
  validateAccessToken,
  validateRefreshToken,
  findToken,
};
