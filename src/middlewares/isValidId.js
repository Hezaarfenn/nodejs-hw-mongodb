import { isValidObjectId } from "mongoose";
import createErrors from "http-errors";

const isValidId = (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    throw createErrors(400, "Invalid contact id");
  }
  next();
};

export default isValidId;
