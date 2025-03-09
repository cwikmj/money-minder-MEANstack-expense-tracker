require('../config/passport')
const passport = require('passport')
const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller')
const { authenticate } = require('../middleware/auth');
const requireAuth = passport.authenticate('jwt', {
    session: false
})


router.post('/login', controller.login);

router.get('/logout', requireAuth, authenticate, controller.logout);

router.get('/refresh-token', requireAuth, authenticate, controller.refreshToken);

router.post('/register', controller.register);

router.post('/change-password', requireAuth, authenticate, controller.changePassword);

router.post('/update-profile', requireAuth, authenticate, controller.updateProfile);

module.exports = router;
