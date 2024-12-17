const router = require('express').Router();
const {login, getMe} = require('../controller/auth.controllers');
const {restrict} = require('../middlewares/auth.middlewares');

router.post('/login', login);
router.get('/me', restrict, getMe);

module.exports = router;