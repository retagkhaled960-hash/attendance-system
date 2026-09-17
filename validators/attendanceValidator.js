const Joi = require('joi');


const createAttendanceSchema = Joi.object({
    userId: Joi.number().integer().positive().optional(),
    checkInTime: Joi.date().iso().optional()
});



const updateAttendanceSchema = Joi.object({
    userId: Joi.number().integer().positive().optional(),
    checkOutTime: Joi.date().iso().optional()
});



module.exports = {
    createAttendanceSchema,
    updateAttendanceSchema
};
