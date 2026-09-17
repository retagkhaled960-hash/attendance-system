const pool = require('../config/db');

class DepartmentModel {
    static async findAll() {
        const query = 'SELECT * FROM departments';
        const { rows } = await pool.query(query);
        return rows;
    }


     static async findById(id) {
        const query = 'SELECT * FROM departments WHERE id = $1';
        const { rows } = await pool.query(query, [id]);
        return rows[0];
    }



    static async create({ name, description }) {
        const query = `
            INSERT INTO departments (name, description)
            VALUES ($1, $2)
            RETURNING *;
        `;

        const values = [name, description || null];
        const { rows } = await pool.query(query, values);
        return rows[0];
    }

    static async deleteById(id) {
        const query = 'DELETE FROM departments WHERE id = $1 RETURNING *';
        const { rows } = await pool.query(query, [id]);
        return rows[0];
    }
}

module.exports = DepartmentModel;
