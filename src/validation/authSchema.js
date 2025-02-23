import Joi from "joi";

const registerUserSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().min(3).max(20).email().required(),
  password: Joi.string().min(3).max(20).required(),
});

export default registerUserSchema;
