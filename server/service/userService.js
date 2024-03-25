import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import {
  findToken,
  generateTokens,
  removeToken,
  removeTokenById,
  saveToken,
  validateRefreshToken,
} from "../service/tokenService.js";
import userDto from "../dtos/userDto.js";
import ApiError from "../exceptions/apiError.js";

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
    throw ApiError.BadRequest(`Benutzer wurde nicht gefunden`);
  }
  if (email !== userFromData.email) {
    const userExists = await User.findOne({ email });
    if (userExists) {
      throw ApiError.BadRequest(
        `Benutzer mit E-Mail-Adresse ${email} existiert bereits`
      );
    }
  }

  let hashedPassword = null;

  if (newPassword && oldPassword && newPassword !== oldPassword) {
    const isPasswordValid = await bcrypt.compare(
      oldPassword,
      userFromData.password
    );
    if (!isPasswordValid) {
      throw ApiError.BadRequest(`Das alte Passwort ist falsch`);
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
  const token = await removeToken(refreshToken);
  return token;
};

const refresh = async (refreshToken) => {
  if (!refreshToken) {
    throw ApiError.UnauthorizedError();
  }

  const userData = validateRefreshToken(refreshToken);
  const tokenFromDB = await findToken(refreshToken);

  if (!userData || !tokenFromDB) {
    throw ApiError.InvalidRefreshToken();
  }

  const user = await User.findById(userData.user.id);

  const newUser = userDto(user);
  const tokens = generateTokens({ ...newUser });
  await saveToken(newUser.id, tokens.refreshToken);

  return { ...tokens, user: newUser };
};

const getAllUsers = async () => {
  const users = await User.find()
    .select("firstName lastName email birthDate isAdmin image")
    .lean();

  // Переименовываем _id в id для каждого пользователя
  const usersWithId = users.map((user) => {
    return { ...user, id: user._id, _id: undefined };
  });

  return usersWithId;
};

export { registration, login, update, logout, refresh, getAllUsers };
