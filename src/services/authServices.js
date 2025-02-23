import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import UserCollection from "../db/models/userModel.js";

const registerUserServices = async ({ name, email, password }) => {
  const user = await UserCollection.findOne({ email: email.toLowerCase() });
  if (user) throw createHttpError(409, "Email in use!");

  const hashedPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  };

  const newUser = new UserCollection({ name, email, password: hashedPassword });
  await newUser.save();

  return newUser;
};

export default registerUserServices;
