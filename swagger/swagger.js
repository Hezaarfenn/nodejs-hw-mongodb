import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";

const swaggerFilePath = path.resolve("docs/swagger.json");
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerFilePath, "utf-8"));

export default (app) => {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
