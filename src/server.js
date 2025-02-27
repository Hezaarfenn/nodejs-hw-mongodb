import express from "express";
import cors from "cors";
import pino from "pino";
import pinoHttp from "pino-http";
import cookieParser from "cookie-parser";
import contactsRouter from "./routers/contactsRouter.js";
import authRouter from "./routers/authRouter.js";
import errorHandler from "./middlewares/errorHandler.js";
import notFoundHandler from "./middlewares/notFoundHandler.js";
import { initializeStorage } from "./utils/checkAndCreateDir.js";

const setupServer = async () => {
  await initializeStorage();

  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(cookieParser());

  const logger = pino();
  app.use(pinoHttp({ logger }));

  app.get("/", (req, res) => {
    res.json({ message: "Welcome to the Contacts API" });
  });

  app.use("/contacts", contactsRouter);
  app.use("/auth", authRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

export default setupServer;
