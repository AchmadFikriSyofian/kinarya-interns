const router = require('express').Router();
const {register, registerMentor, login, updateUser, updateMentor, getMe} = require('../controller/auth.controllers');
const {restrict} = require('../middlewares/auth.middlewares');

router.post('/register', register);
router.post('/register/mentor', registerMentor);
router.post('/login', login);
router.put('/user/:id', updateUser);
router.put('/mentor/:id', updateMentor);
router.get('/me', restrict, getMe);

module.exports = router;