const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const { createAttendanceSchema, updateAttendanceSchema } = require('../validators/attendanceValidator');
const AttendanceController = require('../controllers/attendanceController');


router.get('/', verifyToken, checkRole(['admin', 'manager']), AttendanceController.getAllAttendance);



router.get('/users/:userId', verifyToken, checkRole(['admin', 'manager']), AttendanceController.getAttendanceByUserId);
router.get('/me', verifyToken, AttendanceController.getMyAttendance);


router.post('/check-in', verifyToken, checkRole(['admin', 'manager', 'employee']), validate(createAttendanceSchema), AttendanceController.checkIn);



router.post('/check-out', verifyToken, checkRole(['admin', 'manager', 'employee']), validate(updateAttendanceSchema), AttendanceController.checkOut);


module.exports = router;
