import { randomBytes } from "crypto";
import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import UserCollection from "../db/models/userModel.js";
import { FIFTEEN_MINUTES, ONE_DAY } from "../constants/indexConstants.js";
import { SessionsCollection } from "../db/models/sessionModel.js";

const createSession = () => {
  const accessToken = randomBytes(30).toString("base64");
  const refreshToken = randomBytes(30).toString("base64");
  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: Date.now() + FIFTEEN_MINUTES,
    refreshTokenValidUntil: Date.now() + ONE_DAY,
  };
};

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
  if (!user) {
    throw createHttpError(404, "User not found");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw createHttpError(401, "Unauthorized");
  }

  await SessionsCollection.deleteOne({ userId: user._id });
  const session = createSession();

  return await SessionsCollection.create({
    userId: user._id,
    ...session,
  });
};

export const refreshUsersSessionServices = async ({
  sessionId,
  refreshToken,
}) => {
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken: refreshToken,
  });
  if (!session) {
    throw createHttpError(401, "Session not found");
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    throw createHttpError(401, "Session token expired");
  }

  const newSession = createSession();
  await SessionsCollection.deleteOne({
    _id: sessionId,
    refreshToken: refreshToken,
  });

  return await SessionsCollection.create({
    userId: session.userId,
    ...newSession,
  });
};
