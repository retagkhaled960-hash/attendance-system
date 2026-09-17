const Joi = require('joi');

const registerSchema = Joi.object({
    username: Joi.string().min(3).max(30).required().messages({
       'string.min': 'Username must be at least 3 characters long',
        'any.required': 'Username is required'
    }),

    
    email: Joi.string().email().required().messages({
       'string.email': 'Invalid email format',
        'any.required': 'Email is required'
    }),
    

    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters long',
        'any.required': 'Password is required'
    }),
    role: Joi.forbidden().messages({
        'any.unknown': 'Role cannot be assigned during public registration'
    })
});

const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Invalid email format',
        'any.required': 'Email is required'
    }),
    password: Joi.string().required().messages({
        'any.required': 'Password is required'
    })
});



const updatePasswordSchema = Joi.object({
    currentPassword: Joi.string().min(6).required().messages({
        'string.min': 'Current password must be at least 6 characters long',
        'any.required': 'Current password is required to confirm identity'
    }),
    newPassword: Joi.string().min(6).required().messages({
        'string.min': 'New password must be at least 6 characters long',
        'any.required': 'New password is required'
    })
});




const createUserSchema = Joi.object({
    username: Joi.string().min(3).required().messages({
        'string.min': 'Username must be at least 3 characters long',
        'any.required': 'Username is required'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Invalid email format',
        'any.required': 'Email is required'
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Password must be at least 6 characters long',
        'any.required': 'Password is required'
    }),
    role: Joi.string().valid('admin', 'manager', 'employee').required().messages({
        'any.only': 'Role must be one of admin, manager, or employee',
        'any.required': 'Role is required'
    })
});


module.exports = {
    registerSchema,
    loginSchema,
    createUserSchema,
    updatePasswordSchema
};
