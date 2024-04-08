// userValidation.js
import Joi from 'joi';

export const validationSchema = Joi.object({
    username: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(4).required(),
    mobile: Joi.number().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    profile: Joi.string().required(),
    gender: Joi.string().required()
});


