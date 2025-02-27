import { THIRTY_DAY } from "../constants/indexConstants.js";
import {
  registerUserServices,
  loginUserServices,
  logoutUserServices,
  resetPasswordServices,
} from "../services/authServices.js";
import {
  refreshUsersSessionServices,
  requestResetToken,
} from "../services/authServices.js";

const setupCookie = (res, session) => {
  res.cookie("refreshToken", session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAY),
  });
  res.cookie("sessionId", session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAY),
  });
};

export const registerUserController = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await registerUserServices({ name, email, password });

    res.status(201).json({
      status: 201,
      message: "Successfully registered a user!",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const loginUserController = async (req, res) => {
  const session = await loginUserServices(req.body);

  setupCookie(res, session);

  res.json({
    status: 200,
    message: "Successfully logged in an user!",
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const refreshUserSessionController = async (req, res) => {
  const session = await refreshUsersSessionServices({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  setupCookie(res, session);

  res.json({
    status: 200,
    message: "Successfully refreshed a session!",
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutUserController = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutUserServices({ sessionId: req.cookies.sessionId });
  }

  res.clearCookie("sessionId");
  res.clearCookie("refreshToken");

  res.status(204).send();
};

export const requestResetEmailController = async (req, res) => {
  await requestResetToken(req.body.email);
  res.json({
    message: "Reset password email was successfully sent!",
    status: 200,
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  await resetPasswordServices(req.body);
  res.json({
    message: "Password was successfully reset!",
    status: 200,
    data: {},
  });
};
