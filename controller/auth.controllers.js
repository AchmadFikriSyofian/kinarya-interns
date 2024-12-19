const mysql = require('mysql2');
const { connection } = require('../config/db');
const jwt = require('jsonwebtoken');
const e = require('express');
const { JWT_SECRET_KEY } = process.env;

module.exports = {
    register: async (req, res, next) => {
        try {
            let {username, email, password, no_hp, address, division, institute, major} = req.body;

            
            if(!username || !email || !password || !no_hp || !address || !division || !institute || !major) {
                return res.status(400).json({
                    status: false,
                    message: 'Bad Request',
                    err: 'Please fill all the fields!',
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

            if(!username || !email || !password || !division) {
                return res.status(400).json({
                    status: false,
                    message: 'Bad Request',
                    err: 'Please fill all the fields',
                    data: null
                });
            }

            let checkEmail = `SELECT * FROM mentors WHERE email = ?`;
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

                let query = `INSERT INTO mentors (username, email, password, division) VALUES (?, ?, ?, ?)`;
                connection.query(query, [username, email, password, division], (err, results) => {
                    if(err) {
                        return res.status(500).json({
                            status: false,
                            message: 'Internal Server Error',
                            err: err.message,
                            data: null
                        });
                    }

                    let newMentor = `SELECT * FROM mentors WHERE id = ?`;
                    connection.query(newMentor, [results.insertId], (err, data) => {
                        return res.status(201).json({
                            status: true,
                            message: 'Created',
                            err: null,
                            data: data[0]
                        });
                    });
                });
            });
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

    updateUser: async (req, res, next) => {
        try {
            let {id} = req.params;
            let {username, email, password, no_hp, address, division, institute, major} = req.body;

            if(!id) {
                return res.status(400).json({
                    status: false,
                    message: 'Bad Request',
                    err: `User with id ${id} is not exist!`,
                    data: null
                });
            }

            let query = `SELECT * FROM users WHERE id = ?`;
            connection.query(query, [id], (err, results) => {
                if(err) {
                    return res.status(500).json({
                        status: false,
                        message: 'Internal Server Error',
                        err: err.message,
                        data: null
                    });
                }

                if(results.length === 0) {
                    return res.status(404).json({
                        status: false,
                        message: 'Not Found',
                        err: 'User Not Found',
                        data: null
                    });
                }

                let udpdateFields = [];
                let updateValues = [];

                if(username) {
                    udpdateFields.push('username = ?');
                    updateValues.push(username);
                }

                if(email) {
                    udpdateFields.push('email = ?');
                    updateValues.push(email);
                }

                if(password) {
                    udpdateFields.push('password = ?');
                    updateValues.push(password);
                }

                if(no_hp) {
                    udpdateFields.push('no_hp = ?');
                    updateValues.push(no_hp);
                }
                
                if(address) {
                    udpdateFields.push('address = ?');
                    updateValues.push(address);
                }

                if(division) {
                    udpdateFields.push('division = ?');
                    updateValues.push(division);
                }

                if(institute) {
                    udpdateFields.push('institute = ?');
                    updateValues.push(institute);
                }

                if(major) {
                    udpdateFields.push('major = ?');
                    updateValues.push(major);
                }

                updateValues.push(id);

                connection.query(`UPDATE users SET ${udpdateFields.join(', ')} WHERE id = ?`, updateValues, (err, updateResults) => {
                    if(err) {
                        return res.status(500).json({
                            status: false,
                            message: 'Internal Server Error',
                            err: err.message,
                            data: null
                        });
                    }

                    return res.status(200).json({
                        status: true,
                        message: 'OK',
                        err: null,
                        data: {
                            id,
                            username: username || results[0].username,
                            email: email || results[0].email,
                            password: password || results[0].password,
                            no_hp: no_hp || results[0].no_hp,
                            address: address || results[0].address,
                            division: division || results[0].division,
                            institute: institute || results[0].institute,
                            major: major || results[0].major
                        }
                    });
                });
            });

        } catch(err) {
            next(err);
        }
    },

    updateMentor: async (req, res, next) => {
        try {
            let {id} = req.params;
            let {username, email, password, division} = req.body;

            if(!id) {
                return res.status(400).json({
                    status: false,
                    message: 'Bad Request',
                    err: 'Mentor ID is required!',
                    data: null
                });
            }

            let query = `SELECT * FROM mentors WHERE id = ?`;
            connection.query(query, [id], (err, results) => {
                if(err) {
                    return res.status(500).json({
                        status: false,
                        message: 'Internal Server Error',
                        err: err.message,
                        data: null
                    });
                }

                if(results.length === 0) {
                    return res.status(404).json({
                        status: false,
                        message: 'Not Found',
                        err: `Mentor with id ${id} doesn\'t Exist`,
                        data: null
                    });
                }

                let udpdateFields = [];
                let updateValues = [];

                if(username) {
                    udpdateFields.push('username = ?');
                    updateValues.push(username);
                }

                if(email) {
                    udpdateFields.push('email = ?');
                    updateValues.push(email);
                }

                if(password) {
                    udpdateFields.push('password = ?');
                    updateValues.push(password);
                }

                if(division) {
                    udpdateFields.push('division = ?');
                    updateValues.push(division);
                }

                updateValues.push(id);

                connection.query(`UPDATE mentors SET ${udpdateFields.join(', ')} WHERE id = ?`, updateValues, (err, updateResults) => {
                    if(err) {
                        return res.status(500).json({
                            status: false,
                            message: 'Internal Server Error',
                            err: err.message,
                            data: null
                        });
                    }

                    return res.status(200).json({
                        status: true,
                        message: 'OK',
                        err: null,
                        data: {
                            id, 
                            username: username || results[0].username,
                            email: email || results[0].email,
                            password: password || results[0].password,
                            division: division || results[0].division
                        }
                    });
                });
            });
        } catch(err) {
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