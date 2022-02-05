const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const adminAuth = require('../middleware/adminAuth')
const userController = require('../controllers/User.controller.js')



// REGISTER

router.post('/signup', userController.signupUser);

// Update profile
router.post('/updateProfile', auth, userController.updateProfile);

// Verify user email
router.get('/verifyEmail/:id', userController.verifyEmail);


//LOGIN
router.post('/login', userController.login);


//LOGOUT
router.get('/logout', auth, userController.logout);


router.get('/loggedIn', userController.checkIfLoggedIn);

router.get('/isAdmin', userController.checkIfAdmin);

router.get('/getFullNameAndIsCollegeId', auth, userController.getFullNameAndIsCollegeId);

router.get('/getAllUserDetails', adminAuth, userController.getAllUserDetails)

router.get('/getAllAdminDetails', adminAuth, userController.getAllAdminDetails)

router.post('/makeUserAdmin/:id', adminAuth, userController.makeUserAdmin)

router.post('/removeUserFromAdmin/:id', adminAuth, userController.removeUserFromAdmin)

router.get('/getUserDetailsForUpdate', auth, userController.getUserDetailsForUpdate)


router.get('/getAllBlockedUserDetails', adminAuth, userController.getAllBlockedUserDetails)

router.get('/getAllMeBlockedUserDetails', adminAuth, userController.getAllMeBlockedUserDetails)

router.post('/blockUserByAdmin/:id', adminAuth, userController.blockUserByAdmin)

router.post('/unblockAnyUserByAdmin/:id', adminAuth, userController.unblockAnyUserByAdmin)

router.post('/unblockMyBlockedUserByAdmin/:id', adminAuth, userController.unblockMyBlockedUserByAdmin)

router.post('/sendEmailForResetPassword', userController.sendEmailForResetPassword)

router.get('/verifyResetPassword/:id', userController.verifyResetPassword);

router.post('/resetPassword', userController.resetPassword)



module.exports = router
