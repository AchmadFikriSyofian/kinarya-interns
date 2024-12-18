const mysql = require('mysql2');
const { connection } = require('../config/db');
const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = process.env;

module.exports = {
    register: async (req, res, next) => {
        try {
            let {username, email, password, no_hp, address, division, institute, major} = req.body;

            
            if(!username || !email || !password || !no_hp || !address || !division || !institute || !major) {
                return res.status(400).json({
                    status: false,
                    message: 'Bad Request',
                    err: 'Please fill all the column!',
                    data: null
                });
            }

            let checkEmail = `SELECT * FROM users WHERE email = ?`;
            connection.query(checkEmail, [email], (err, results) => {
                if(err) {
                    return res.status(500).json({
                        status: false,
                        message: 'Internal Server Error',
                        err: err.message,
                        data: null
                    });
                }

                if(results.length > 0) {
                    return res.status(400).json({
                        status: false,
                        message: 'Bad Request',
                        err: 'Email has already exist!',
                        data: null
                    });
                }

                let query = `INSERT INTO users (username, email, password, no_hp, address, division, institute, major) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
                connection.query(query, [username, email, password, no_hp, address, division, institute, major], (err, results) => {
                    if(err) {
                        return res.status(500).json({
                            status: false,
                            message: 'Internal Server Error',
                            err: err.message,
                            data: null
                        });
                    }
    
                    let newUser = `SELECT * FROM users WHERE id = ?`;
                    connection.query(newUser, [results.insertId], (err, data) => {
                        if(err) {
                            return res.status(500).json({
                                status: false,
                                message: 'Internal Server Error',
                                err: err.message,
                                data: null
                            });
                        }
                        return res.status(201).json({
                            status: true,
                            message: 'Created',
                            err: null,
                            data: data[0],
                        });
                    });
                });
            });
            

        } catch(err) {
            next(err);
        }
    },

    registerMentor: async (req, res, next) => {
        try {
            let {username, email, password, division} = req.body;
            
        } catch(err) {
            next(err);
        }
    },

    login: async (req, res, next) => {
        try {
            let { email, password } = req.body;
    
            if(!email || !password) {
                return res.status(400).json({
                    status: false,
                    message: 'Bad Request',
                    err: 'Email and Password are required',
                    data: null,
                });
            }

            // Check Email
            connection.query(`SELECT * FROM users WHERE email = ?`, [email], async (err, results) => {
                if(err) {
                    return res.status(500).json({
                        status: false,
                        message: 'Internal Server Error',
                        err: err.message,
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

            connection.query(`SELECT * FROM users WHERE id = ?`, [id], (err, results) => {
                if(err) {
                    return res.status(500).json({
                        status: false,
                        message: 'Internal Server Error',
                        err: err.message,
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
    },
}