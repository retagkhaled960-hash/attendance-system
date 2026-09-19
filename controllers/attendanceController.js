const AttendanceModel = require('../models/attendanceModel');

class AttendanceController {
   static async checkIn(req, res, next) {
    try {
        const userId = req.user.id;
        const checkInTime = req.user.role === 'admin' ? req.body.checkInTime : undefined;
        const attendance = await AttendanceModel.checkIn(userId, checkInTime);
        if (!attendance) {
            return res.status(409).json({ error: 'An active check-in already exists for this user.' });
        }
            return res.status(201).json({
                message: 'Checked in successfully!',
                attendance
            });
        } catch (error) {
            next(error);
        }
    }


    static async checkOut(req, res, next) {
        try {
            const userId = req.user.id;
            const checkOutTime = req.user.role === 'admin' ? req.body.checkOutTime : undefined;
            const attendance = await AttendanceModel.checkOut(userId, checkOutTime);
            if (!attendance) {
                return res.status(404).json({ error: 'No active check-in found to check out from.' });
            }
return res.status(200).json({
                message: 'Checked out successfully!',
                attendance
            });
        } catch (error) {
            next(error);
        }
    }


    static async getMyAttendance(req, res, next) {
        try {
            const userId = req.user.id;
            const records = await AttendanceModel.findByUserId(userId);
            return res.status(200).json({
                count: records.length,
                records
            });
        } catch (error) {
            next(error);
        }
    }


    static async getAllAttendance(req, res, next) {
        try {
            const records = await AttendanceModel.findAll();
            return res.status(200).json({
                count: records.length,
                records
            });
        } catch (error) {
            next(error);
        }
    }

    static async getAttendanceByUserId(req, res, next) {
        try {
            const records = await AttendanceModel.findByUserId(req.params.userId);
            return res.status(200).json({ count: records.length, records });
        } catch (error) {
            next(error);
        }
    }
}


module.exports = AttendanceController;
            
