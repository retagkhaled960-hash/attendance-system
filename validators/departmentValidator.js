const Joi = require('joi');

const createDepartmentSchema = Joi.object({
    name: Joi.string().min(3).required().messages({
       'string.min': 'Department name must be at least 3 characters long',
        'any.required': 'Department name is required'
    }),


description: Joi.string().max(200).optional().messages({
        'string.max': 'Description cannot exceed 200 characters'
    })
});



const updateDepartmentSchema = Joi.object({
    name: Joi.string().min(2).messages({
        'string.min': 'Department name must be at least 2 characters long'
    }),
    description: Joi.string().max(200).messages({
        'string.max': 'Description cannot exceed 200 characters'
    })
});



module.exports = {
    createDepartmentSchema,
    updateDepartmentSchema
};