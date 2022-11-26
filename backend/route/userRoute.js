const express = require('express');
const {registerUser, loginUser, logoutUser, forgetPassword, resetPassword, getUserDeatils, updatePassword, userProfile, getAdminUserDeatils, getAllUser } = require('../controller/userController');
const router = express.Router();
const {isAuthenticated , authorsizeRole} = require('../middleware/auth')


router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logoutUser);
router.route('/forgetPassword').post(forgetPassword);
router.route('/password/reset/:token').put(resetPassword);
router.route('/me').get(isAuthenticated , getUserDeatils);
router.route('/updatePassword').put(isAuthenticated , updatePassword);
router.route('/updateProfile').put(userProfile);
router.route('/admin/user').get(isAuthenticated , authorsizeRole('admin') , getAllUser)
router.route('/admin/getoneuser/:id').get(isAuthenticated , authorsizeRole('admin'),getAdminUserDeatils)

module.exports = router;