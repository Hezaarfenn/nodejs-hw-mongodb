import createErrors from "http-errors";

const validateBody = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body, {
      abortEarly: false,
    });
    next();
  } catch (error) {
    const validateError = createErrors(400, "Validation error", {
      errors: error.details,
    });
    next(validateError);
  }
};

export default validateBody;
