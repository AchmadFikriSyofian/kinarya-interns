const jwt = require('jsonwebtoken');
const {JWT_SECRET_KEY} = process.env;

module.exports = {
    restrict: async (req, res, next) => {
        let {authorization} = req.headers;
        
        if(!authorization) {
            return res.status(401).json({
                status: false,
                message: 'Unauthorized',
                err: 'Missing token on header',
                data: null,
            });
        }

        jwt.verify(authorization, JWT_SECRET_KEY, (err, user) => {
            if(err) {
                return res.status(401).json({
                    status: false,
                    message: 'Unauthorized',
                    err: err.message,
                    data: null
                });
            }

            req.user = user;
            next();
        })
    }
}