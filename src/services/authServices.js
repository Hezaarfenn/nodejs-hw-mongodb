import UserCollection from "../db/models/user.js";

const registerUserServices = async (payload) => {
  return await UserCollection.create(payload);
};

export default registerUserServices;
