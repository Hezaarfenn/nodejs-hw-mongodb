import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const initMongoConnection = async () => {
  try {
    const user = process.env.MONGODB_USER;
    const pwd = process.env.MONGODB_PASSWORD;
    const url = process.env.MONGODB_URL;
    const db = process.env.MONGODB_DB;

    const URI = `mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority`;

    await mongoose.connect(URI);
    console.log("Mongo connection successfully established!");
  } catch (error) {
    console.error("Error while setting up mongo connection", error);
    process.exit(1);
  }
};

export default initMongoConnection;
