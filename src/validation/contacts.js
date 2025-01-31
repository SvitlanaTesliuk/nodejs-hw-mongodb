import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name should have at least 3 characters",
    "string.max": "Name should have at most 20 characters",
  }),

  age: Joi.number().integer().min(6).max(16).required().messages({
    "number.base": "Age must be a number",
    "number.min": "Age must be at least 6",
    "number.max": "Age must be at most 16",
  }),

  gender: Joi.string().valid("male", "female", "other").required().messages({
    "any.only": "Gender must be 'male', 'female', or 'other'",
  }),

  avgMark: Joi.number().min(2).max(12).required().messages({
    "number.base": "Average mark must be a number",
    "number.min": "Average mark must be at least 2",
    "number.max": "Average mark must be at most 12",
  }),

  onDuty: Joi.boolean().messages({
    "boolean.base": "OnDuty must be a boolean value",
  }),
});

export const updateContactSchema = Joi.object({
    name: Joi.string().min(3).max(20).messages({
      "string.min": "Name should have at least 3 characters",
      "string.max": "Name should have at most 20 characters",
    }),

    age: Joi.number().integer().min(6).max(16).messages({
      "number.min": "Age must be at least 6",
      "number.max": "Age must be at most 16",
    }),

    gender: Joi.string().valid("male", "female", "other").messages({
      "any.only": "Gender must be 'male', 'female', or 'other'",
    }),

    avgMark: Joi.number().min(2).max(12).messages({
      "number.min": "Average mark must be at least 2",
      "number.max": "Average mark must be at most 12",
    }),

    onDuty: Joi.boolean().messages({
      "boolean.base": "OnDuty must be a boolean value",
    }),
  }).min(1); 
