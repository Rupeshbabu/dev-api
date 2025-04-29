const express = require('express');
const { register, login, getMe, forgotPassword, resetPassword, updateUserDetails, updateUserPassword } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/me').get(protect, getMe);
router.route('/forgotpassword').post(forgotPassword);
router.route('/resetpassword/:resetToken').put(resetPassword);
router.route('/updatedetails').put(protect, updateUserDetails);
router.route('/updatepassword').put(protect, updateUserPassword);



module.exports = router;