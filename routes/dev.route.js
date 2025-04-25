const {getDev, getDevDetails, postDev, updateDev, deleteDev} = require('../controllers/dev.controller');

const express = require('express');
const router = express.Router();

router.route('/').get(getDev).post(postDev)
router.route('/:id').get(getDevDetails).put(updateDev).delete(deleteDev);

module.exports = router;
