const UserModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthController {
    static async register(req, res, next) {
        try {
            const { username, email, password } = req.body;
            const existingUser = await UserModel.findByEmail(email);

            if (existingUser) {
                return res.status(409).json({ error: 'Email is already in use.' });
            }

            const passwordHash = await bcrypt.hash(password, 10);
            // Public registration must never allow a caller to assign admin privileges.
            const user = await UserModel.create({
                username,
                email,
                passwordHash,
                role: 'employee'
            });

            return res.status(201).json({
                message: 'User registered successfully!',
                user
            });
        } catch (error) {
            next(error);
        }
    }

    static async login(req, res, next) {
        try {
            const { email, password } = req.body;

            const user = await UserModel.findByEmail(email);
            if (!user) {
                return res.status(401).json({ error: 'Invalid email or password.' });
            }


            const isPasswordValid = await bcrypt.compare(password, user.password_hash);
            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid email or password.' });
            }

            const token = jwt.sign(
                { id: user.id, role: user.role, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );

            return res.status(200).json({
                message: 'Logged in successfully!',
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    employee_code: user.employee_code
                }
            });

        } catch (error) {
            next(error);
        }
    }
}

module.exports = AuthController;
