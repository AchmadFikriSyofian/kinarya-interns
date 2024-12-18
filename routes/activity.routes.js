const router = require('express').Router();
const {addActivities, getAllActivities, getUserActivities, updateActivities, deleteActivities} = require('../controller/activity.controllers');
const {restrict} = require('../middlewares/auth.middlewares');

router.post('/', restrict, addActivities);
router.get('/', getAllActivities);
router.get('/user', restrict, getUserActivities);
router.put('/:id', restrict, updateActivities);
router.delete('/:id', deleteActivities);

module.exports = router;