import createHttpError from "http-errors";

const validateBody = (schema) => async (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    console.log("Validation error details:", error.details);
    return next(
      createHttpError(400, "Validation error", { errors: error.details }),
    );
  }
  next();
};

export default validateBody;
