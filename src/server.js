import express from "express";
import cors from "cors";
import pino from "pino";
import pinoHttp from "pino-http";
import contactsRouter from "./routers/contactsRouter.js";
import authRouter from "./routers/authRouter.js";
import errorHandler from "./middlewares/errorHandler.js";
import notFoundHandler from "./middlewares/notFoundHandler.js";

const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

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
