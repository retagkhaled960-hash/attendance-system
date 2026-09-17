const UserModel = require('../models/userModel');
const bcrypt = require('bcrypt');

class UserController {
    static async register(req, res, next) {
        try {
            const { username, email, password, role, employeeCode, departmentId } = req.body;
            const requesterRole = req.user.role;
             let finalRole = 'employee';

             if (requesterRole === 'admin') {
                finalRole = role || 'employee';
             } else if (requesterRole === 'manager') {
                    if (role && role !== 'employee') {
                    return res.status(403).json({
                        error: 'Managers can only create employee accounts.'
                });
            }
            finalRole = 'employee';
        }   


            const existingUser = await UserModel.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({ error: 'Email is already in use. Please choose another one.' });
            }

            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(password, saltRounds);

            const newUser = await UserModel.create({
                username,
                email,
                passwordHash,
                role: finalRole,
                employeeCode,
                departmentId
            });

            return res.status(201).json({
                message: 'User registered successfully!',
                user: newUser
            });

        } catch (error) {
            next(error);
        }
    }

    static async getAllUsers(req, res, next) {
        try {
            const users = await UserModel.findAll();
            return res.status(200).json({
                count: users.length,
                users
            });
        } catch (error) {
            next(error);
        }
    }

    static async getUserById(req, res, next) {
        try {
            const user = await UserModel.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ error: 'User not found.' });
            }
            return res.status(200).json({ user });
        } catch (error) {
            next(error);
        }
    }

    static async deleteUser(req, res, next) {
        try {
            const user = await UserModel.deleteById(req.params.id);
            if (!user) {
                return res.status(404).json({ error: 'User not found.' });
            }
            return res.status(200).json({ message: 'User deleted successfully.', user });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = UserController;
