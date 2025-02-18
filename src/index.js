import dotenv from "dotenv";
import initMongoConnection from "../src/db/initMongoConnection.js";
import setupServer from "../src/server.js";

dotenv.config();

const startServer = async () => {
  await initMongoConnection();
  setupServer();
};

startServer();
