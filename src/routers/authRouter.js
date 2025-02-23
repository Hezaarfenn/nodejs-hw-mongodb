import express from "express";
import ctrlWrapper from "../utils/ctrlWrapper.js";
import validateBody from "../middlewares/validateBody.js";
import {
  registerUserSchema,
  loginUserSchema,
} from "../validation/authSchema.js";
import {
  registerUserController,
  loginUserController,
  refreshUserSessionController,
} from "../controllers/authContoller.js";

const router = express.Router();

router.post(
  "/register",
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

router.post(
  "/login",
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);

router.post("/refresh", ctrlWrapper(refreshUserSessionController));

export default router;
