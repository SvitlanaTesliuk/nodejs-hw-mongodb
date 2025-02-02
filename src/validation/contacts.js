import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name should have at least 3 characters",
    "string.max": "Name should have at most 20 characters",
  }),
  phoneNumber: Joi.string().min(10).max(15).required().messages({
    "string.empty": "Phone number is required",
    "string.min": "Phone number should have at least 10 digits",
    "string.max": "Phone number should have at most 15 digits",
  }),
  email: Joi.string().email().messages({
    "string.email": "Invalid email format",
  }),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid("work", "home", "personal").messages({
    "any.only": "Contact type must be one of: work, home, personal",
  }),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).messages({
    "string.min": "Name should have at least 3 characters",
    "string.max": "Name should have at most 20 characters",
  }),
  phoneNumber: Joi.string().min(10).max(15).messages({
    "string.min": "Phone number should have at least 10 digits",
    "string.max": "Phone number should have at most 15 digits",
  }),
  email: Joi.string().email().messages({
    "string.email": "Invalid email format",
  }),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid("work", "home", "personal").messages({
    "any.only": "Contact type must be one of: work, home, personal",
  }),
}).min(1);
