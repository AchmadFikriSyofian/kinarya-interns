const mysql = require('mysql2');
const { connection } = require('../config/db');
const {getPagination} = require('../libs/pagination');
const { restart } = require('nodemon');
const JWT_SECRET_KEY = process.env;

module.exports = {
    addActivities: async (req, res, next) => {
        try {
            let {activity, desc_activity} = req.body;
            let userId = req.user.id;

            if(!activity || !desc_activity) {
                return res.status(400).json({
                    status: false,
                    message: 'Bad Request',
                    err: 'Activity and Description are required!',
                    data: null
                });
            }

            let query = `INSERT INTO activity_reports (activity, desc_activity, user_id) VALUES (?, ?, ?)`;

            connection.query (query, [activity, desc_activity, userId], (err, results) => {
                if(err) {
                    return res.status(500).json({
                        status: false,
                        message: 'Internal Server Error',
                        err: 'Database Error',
                        data: null
                    });
                }

                let newActivity = `SELECT * FROM activity_reports WHERE id = ?`;

                connection.query(newActivity, [results.insertId], (err, data) => {
                    return res.status(201).json({
                        status: true,
                        message: 'Created',
                        err: null,
                        data: data[0],
                    });
                });
            });

        } catch(err) {
            next(err);
        }
    },

    getAllActivities: async (req, res, next) => {
        try {

            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;

            connection.query(`SELECT COUNT(*) AS count FROM activity_reports`, (err, results) => {
                if(err) {
                    return res.status(500).json({
                        status: false,
                        message: 'Internal Server Error',
                        err: 'Database Error',
                        data: null
                    });
                }

                const totalItems = results[0].count;

                connection.query(`SELECT * FROM activity_reports LIMIT ? OFFSET ?`, [limit, offset], (err, data) => {
                    if(err) {
                        return res.status(500).json({
                            status: false,
                            message: 'Internal Server Error',
                            err: 'Database Error',
                            data: null
                        });
                    }
                    if(data.length === 0) {
                        return res.status(404).json({
                            status: false,
                            message: 'Not Found',
                            err: 'No Activites found',
                            data: null
                        });
                    }
    
                    const pagination = getPagination(req, totalItems, page, limit);
    
                        return res.status(200).json({
                            status: true,
                            message: 'OK',
                            err: null,
                            data: data,
                            pagination
                        });
                })
            });
        } catch(err) {
            next(err);
        }
    },

    getUserActivities: async (req, res, next) => {
        try {
            let userId = req.user.id;

            connection.query(`SELECT * FROM activity_reports WHERE user_id = ?`, [userId], (err, data) => {
                if(err) {
                    return res.status(500).json({
                        status: false,
                        message: 'Internal Server Error',
                        err: 'Database Error',
                        data: null
                    });
                }

                if(data.length === 0) {
                    return res.status(404).json({
                        status: false,
                        message: 'Not Found',
                        err: 'Your Activities doesn\'t exist!',
                        data: null
                    });
                }

                return res.status(200).json({
                    status: true,
                    message: 'OK',
                    err: null,
                    data: data
                })
            });
        } catch(err) {
            next(err);
        }
    },

    
}