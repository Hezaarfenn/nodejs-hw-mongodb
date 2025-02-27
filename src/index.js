import dotenv from "dotenv";
import initMongoConnection from "../src/db/initMongoConnection.js";
import setupServer from "../src/server.js";
import createDirIfNotExists from "./utils/createDirIfNotExists.js";
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from "./constants/indexConstants.js";

dotenv.config();

const startServer = async () => {
  await initMongoConnection();
  setupServer();
};

const bootstrap = async () => {
  await initMongoConnection();
  await createDirIfNotExists(TEMP_UPLOAD_DIR);
  await createDirIfNotExists(UPLOAD_DIR);
  startServer();
};

void bootstrap();
