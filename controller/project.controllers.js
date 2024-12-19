const mysql = require('mysql2');
const {connection} = require('../config/db');
const jwt = require('jsonwebtoken');
const {JWT_SECRET_KEY} = process.env;

module.exports = {
    updateProject: async(req, res, next) => {
        try {
            let userId = req.user.id;
            let {project_title, project_desc} = req.body;

            let checkQuery = `SELECT * FROM projects WHERE user_id = ?`;
            connection.query(checkQuery, [userId], (err, results) => {
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
                        err: `No project found for this user!`,
                        data: null
                    });
                }

                let updateFields = [];
                let updateValues = [];

                if(project_title) {
                    updateFields.push('project_title = ?');
                    updateValues.push(project_title);
                }

                if(project_desc) {
                    updateFields.push('project_desc = ?');
                    updateValues.push(project_desc);
                }

                updateValues.push(userId);

                const updateQuery = `UPDATE projects SET ${updateFields.join(', ')} WHERE user_id = ?`;
                connection.query(updateQuery, updateValues, (err, updateResults) => {
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
                            project_title: project_title || results[0].project_title,
                            project_desc: project_desc || results[0].project_desc
                        }
                    });
                });
            });
        } catch(err) {
            next(err);
        }
    },
}