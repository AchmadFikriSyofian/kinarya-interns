const router = require('express').Router();
const {addActivities, getAllActivities, getUserActivities} = require('../controller/activity.controllers');
const {restrict} = require('../middlewares/auth.middlewares');

router.post('/', restrict, addActivities);
router.get('/', getAllActivities);
router.get('/user', restrict, getUserActivities);

module.exports = router;