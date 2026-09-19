const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const { createUserSchema } = require('../validators/userValidator');
const UserController = require('../controllers/userController');



router.get('/', verifyToken, checkRole(['admin', 'manager']), UserController.getAllUsers);


router.get('/:id', verifyToken, checkRole(['admin', 'manager']), UserController.getUserById);


router.post('/', verifyToken, checkRole(['admin', 'manager']), validate(createUserSchema), UserController.register);


router.delete('/:id', verifyToken, checkRole(['admin']), UserController.deleteUser);


module.exports = router;
