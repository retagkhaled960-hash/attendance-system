const pool = require('../config/db');

class UserModel {
    static async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = $1';
        const { rows } = await pool.query(query, [email]);
        return rows[0];
         }

        
    static async findById(id) {
        const query = `SELECT id, username, email, role, employee_code, department_id,
        created_at FROM users WHERE id = $1`;
        const { rows } = await pool.query(query, [id]);
        return rows[0];
    }
    

    static async create({ username, email, passwordHash, role, employeeCode, departmentId }) {
        const query = `
            INSERT INTO users (username, email, password_hash, role, employee_code, department_id)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, username, email, role, employee_code, department_id, created_at;
        `;


        const generatedCode = employeeCode || `EMP-${Date.now().toString().slice(-6)}`;

        const values = [
            username, 
            email, 
            passwordHash, 
            role, 
            generatedCode,
            departmentId || null
        ];
        
        const { rows } = await pool.query(query, values);
        return rows[0];
    }

    static async findAll() {
        const query = 'SELECT id, username, email, role, employee_code, department_id, created_at FROM users';
        const { rows } = await pool.query(query);
        return rows;
    }

    static async deleteById(id) {
        const query = `
            DELETE FROM users
            WHERE id = $1
            RETURNING id, username, email, role, employee_code, department_id, created_at
        `;
        const { rows } = await pool.query(query, [id]);
        return rows[0];
    }
}

module.exports = UserModel;
