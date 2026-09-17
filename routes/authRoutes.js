const express = require('express');
const router = express.Router();
const validate = require('../middleware/validateMiddleware');
const { loginSchema } = require('../validators/authValidator');
const { registerSchema } = require('../validators/userValidator');
const AuthController = require('../controllers/authController');


router.post('/register', validate(registerSchema), AuthController.register);


router.post('/login', validate(loginSchema), AuthController.login);

module.exports = router;
