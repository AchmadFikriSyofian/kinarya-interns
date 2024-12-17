const mysql = require('mysql2');
const { connection } = require('../config/db');
const jwt = require('jsonwebtoken');
const {JWT_SECRET_KEY} = process.env;

module.exports = {
    login: async (req, res, next) => {
        try {
            let {email, password} = req.body;
    
            if(!email || !password) {
                return res.status(400).json({
                    status: false,
                    message: 'Bad Request',
                    err: 'Email and Password are required',
                    data: null,
                });
            }

            // Check Email
            connection.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
                if(err) {
                    return res.status(500).json({
                        status: false,
                        message: 'Internal Server Error',
                        err: 'Database Error',
                        data: null,
                    });
                }

                if(results.length === 0) {
                    return res.status(404).json({
                        status: false,
                        message: 'Bad Request',
                        err: 'Invalid Email or Password',
                        data: null,
                    });
                }

                const user = results[0];

                // Check Password
                if(password !== user.password) {
                    return res.status(404).json({
                        status: false,
                        message: 'Bad Request',
                        err: 'Invalid Email or Password',
                        data: null,
                    });
                }

                let token = jwt.sign({ id: user.id}, JWT_SECRET_KEY);

                return res.status(200).json({
                    status: true,
                    message: 'OK',
                    err: null,
                    data: {user, token},
                });
            });

        } catch (err) {
            next(err);
        }
    },

    getMe: async(req, res, next) => {
        try {
            let { id } = req.user;

            connection.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
                if(err) {
                    return res.status(500).json({
                        status: false,
                        message: 'Internal Server Error',
                        err: 'Database Error',
                        data: null,
                    });
                }

                if (results.length === 0) {
                    return res.status(404).json({
                        status: false,
                        message: 'Not Found',
                        err: 'User ID is not found',
                        data: null,
                    });
                }

                const user = results[0];

                return res.status(200).json({
                    status: true,
                    message: 'OK',
                    err: null,
                    data: user,
                });
            });
        } catch (err) {
            next(err);
        }
    }
}