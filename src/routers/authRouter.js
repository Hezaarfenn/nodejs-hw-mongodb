import express from "express";
import ctrlWrapper from "../utils/ctrlWrapper.js";
import {
  registerUserSchema,
  loginUserSchema,
} from "../validation/authSchema.js";
import {
  registerUserController,
  loginUserController,
} from "../controllers/authContoller.js";
import validateBody from "../middlewares/validateBody.js";

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

export default router;
