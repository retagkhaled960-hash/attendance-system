const pool = require('../config/db');

class AttendanceModel {
    static async checkIn(userId, checkInTime = null) {
        const query = `
        INSERT INTO attendance (user_id, check_in_time, status)
            SELECT $1, COALESCE($2, NOW()), 'Present'
            WHERE NOT EXISTS (
                SELECT 1 FROM attendance WHERE user_id = $1 AND check_out_time IS NULL
            )
            RETURNING *;
        `;
        const { rows } = await pool.query(query, [userId, checkInTime]);
        return rows[0];
    }



     static async checkOut(userId, checkOutTime = null) {
        const query = `
            UPDATE attendance 
            SET check_out_time = COALESCE($2, NOW())
            WHERE id = (
                SELECT id FROM attendance
                WHERE user_id = $1 AND check_out_time IS NULL
                ORDER BY check_in_time DESC
                LIMIT 1
            )
            RETURNING *;
        `;
        const { rows } = await pool.query(query, [userId, checkOutTime]);
        return rows[0];
    }



    static async findByUserId(userId) {
        const query = 'SELECT * FROM attendance WHERE user_id = $1 ORDER BY check_in_time DESC';
        const { rows } = await pool.query(query, [userId]);
        return rows;
    }



    static async findAll() {
        const query = `
            SELECT attendance.*, users.username, users.employee_code 
            FROM attendance 
            JOIN users ON attendance.user_id = users.id 
            ORDER BY attendance.check_in_time DESC;
        `;
        const { rows } = await pool.query(query);
        return rows;
    }
}


module.exports = AttendanceModel;

