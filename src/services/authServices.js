import { randomBytes } from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import UserCollection from "../db/models/userModel.js";
import {
  FIFTEEN_MINUTES,
  THIRTY_DAY,
  SMTP,
  TEMPLATES_DIR,
} from "../constants/indexConstants.js";
import SessionsCollection from "../db/models/SessionModel.js";
import { env } from "../utils/env.js";
import sendEmail from "../utils/sendMail.js";
import handlebars from "handlebars";
import path from "node:path";
import fs from "node:fs/promises";

const createSession = () => {
  const accessToken = randomBytes(30).toString("base64");
  const refreshToken = randomBytes(30).toString("base64");
  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: Date.now() + FIFTEEN_MINUTES,
    refreshTokenValidUntil: Date.now() + THIRTY_DAY,
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

export const logoutUserServices = async ({ _id: sessionId }) => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};

export const requestResetToken = async (email) => {
  const user = await UserCollection.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw createHttpError(404, "User not found");
  }
  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    env("JWT_SECRET"),
    {
      expiresIn: "5m",
    },
  );

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    "reset-password-email.html",
  );

  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();

  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${env("APP_DOMAIN")}/reset-password?token=${resetToken}`,
  });

  await sendEmail({
    from: env(SMTP.SMTP_FROM),
    to: email,
    subject: "Reset your password",
    html,
  });
};

export const resetPasswordServices = async (payload) => {
  let entries;
  try {
    entries = jwt.verify(payload.token, env("JWT_SECRET"));
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      throw createHttpError(401, "Token is expired or invalid.");
    }
    throw err;
  }

  const user = await UserCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });
  if (!user) {
    throw createHttpError(404, "User not found");
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await UserCollection.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );

  const session = await SessionsCollection.findOne({ userId: user._id }).exec();
  console.log(session);
  if (session !== null) logoutUserServices(session._id);
};
