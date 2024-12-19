const router = require('express').Router();
const {updateProject} = require('../controller/project.controllers');
const {restrict} = require('../middlewares/auth.middlewares');

router.put('/', restrict, updateProject);

module.exports = router;