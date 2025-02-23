import express from "express";
import ctrlWrapper from "../utils/ctrlWrapper.js";
import registerUserSchema from "../validation/authSchema.js";
import registerUserController from "../controllers/authContoller.js";
import validateBody from "../middlewares/validateBody.js";

const router = express.Router();

router.post(
  "/register",
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

export default router;
