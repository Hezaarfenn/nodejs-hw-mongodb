import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import UserCollection from "../db/models/userModel.js";

export const registerUserServices = async ({ name, email, password }) => {
  const user = await UserCollection.findOne({ email: email.toLowerCase() });
  if (user) throw createHttpError(409, "Email in use!");

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new UserCollection({ name, email, password: hashedPassword });
  await newUser.save();

  return newUser;
};

export const loginUserServices = async ({ email, password }) => {
  const user = await UserCollection.findOne({
    email: email.toLowerCase(),
  });
  if (!user) throw createHttpError(401, "Invalid email!");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw createHttpError(401, "Invalid password!");

  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  return { user, accessToken, refreshToken };
};
