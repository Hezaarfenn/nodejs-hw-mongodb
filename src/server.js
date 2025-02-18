import express from "express";
import cors from "cors";
import pino from "pino";
import contactsRouter from "./routes/contactsRoutes.js";

const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  const logger = pino();
  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
  });

  app.use("/contacts", contactsRouter);

  app.use((req, res) => {
    res.status(404).json({
      message: "Not found",
    });
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

export default setupServer;
