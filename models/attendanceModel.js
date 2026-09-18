const pool = require('../config/db');

class AttendanceModel {
    static async checkIn(userId, checkInTime = null) {
        await pool.query(
            `UPDATE attendance
             SET check_out_time = (check_in_time::date + INTERVAL '1 day' - INTERVAL '1 second'),
                 status = 'Auto-closed'
             WHERE user_id = $1
               AND check_out_time IS NULL
               AND check_in_time::date < CURRENT_DATE`,
            [userId]
        );

        const query = `
        INSERT INTO attendance (user_id, check_in_time, status)
            SELECT $1, COALESCE($2, NOW()), 'Present'
            WHERE NOT EXISTS (
                SELECT 1 FROM attendance WHERE user_id = $1 AND check_out_time IS NULL
            )
           RETURNING id, user_id,
                to_char(check_in_time, 'YYYY-MM-DD HH12:MI:SS AM') AS check_in_time,
                to_char(check_out_time, 'YYYY-MM-DD HH12:MI:SS AM') AS check_out_time,
                status;
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
            RETURNING id, user_id,
                to_char(check_in_time, 'YYYY-MM-DD HH12:MI:SS AM') AS check_in_time,
                to_char(check_out_time, 'YYYY-MM-DD HH12:MI:SS AM') AS check_out_time,
                status;
        `;
        const { rows } = await pool.query(query, [userId, checkOutTime]);
        return rows[0];
    }



    static async findByUserId(userId) {
        const query = `
            SELECT id, user_id,
                to_char(check_in_time, 'YYYY-MM-DD HH12:MI:SS AM') AS check_in_time,
                to_char(check_out_time, 'YYYY-MM-DD HH12:MI:SS AM') AS check_out_time,
                status
            FROM attendance
            WHERE user_id = $1
            ORDER BY attendance.check_in_time DESC;
        `;
        const { rows } = await pool.query(query, [userId]);
        return rows;
    }



    static async findAll() {
       const query = `
            SELECT attendance.id, attendance.user_id,
                to_char(attendance.check_in_time, 'YYYY-MM-DD HH12:MI:SS AM') AS check_in_time,
                to_char(attendance.check_out_time, 'YYYY-MM-DD HH12:MI:SS AM') AS check_out_time,
                attendance.status,
                users.username, users.employee_code 
            FROM attendance 
            JOIN users ON attendance.user_id = users.id 
            ORDER BY attendance.check_in_time DESC;
        `;
        const { rows } = await pool.query(query);
        return rows;
    }
}

module.exports = AttendanceModel;

