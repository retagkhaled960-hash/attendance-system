const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const { createDepartmentSchema } = require('../validators/departmentValidator');
const DepartmentController = require('../controllers/departmentController');

router.get('/', verifyToken, checkRole(['admin']), DepartmentController.getAllDepartments);


router.get('/:id', verifyToken, checkRole(['admin', 'manager']), DepartmentController.getDepartmentById);



router.post('/', verifyToken, checkRole(['admin', 'manager']), validate(createDepartmentSchema), DepartmentController.createDepartment);



router.delete('/:id', verifyToken, checkRole(['admin']), DepartmentController.deleteDepartment);

module.exports = router;




