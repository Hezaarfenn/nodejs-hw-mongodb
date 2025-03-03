import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  phoneNumber: Joi.string()
    .pattern(/^[0-9\s]+$/)
    .min(3)
    .max(20)
    .required(),
  email: Joi.string().min(3).email(),
  isFavourite: Joi.boolean().default(false),
  contactType: Joi.string()
    .min(3)
    .max(20)
    .valid("work", "home", "personal")
    .default("personal")
    .required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string()
    .pattern(/^[0-9\s]+$/)
    .min(3)
    .max(20),
  email: Joi.string().min(3).email(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().min(3).max(20).valid("work", "home", "personal"),
});
