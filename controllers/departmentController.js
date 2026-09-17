const DepartmentModel = require('../models/departmentModel');

class DepartmentController {
    static async getAllDepartments(req, res, next) {
        try {
            const departments = await DepartmentModel.findAll();
            return res.status(200).json({
                count: departments.length,
                departments
            });
        } catch (error) {
            next(error);
        }
    }


    static async createDepartment(req, res, next) {
        try {
            const { name, description } = req.body;
            if (!name) {
                return res.status(400).json({ error: 'Department name is required.' });
            }


            const newDepartment = await DepartmentModel.create({ name, description });

            return res.status(201).json({
                message: 'Department created successfully!',
                department: newDepartment
            });
        } catch (error) {
            next(error);
        }
    }

    static async getDepartmentById(req, res, next) {
        try {
            const department = await DepartmentModel.findById(req.params.id);
            if (!department) {
                return res.status(404).json({ error: 'Department not found.' });
            }
            return res.status(200).json({ department });
        } catch (error) {
            next(error);
        }
    }

    static async deleteDepartment(req, res, next) {
        try {
            const department = await DepartmentModel.deleteById(req.params.id);
            if (!department) {
                return res.status(404).json({ error: 'Department not found.' });
            }
            return res.status(200).json({ message: 'Department deleted successfully.', department });
        } catch (error) {
            next(error);
        }
    }
}


module.exports = DepartmentController;
