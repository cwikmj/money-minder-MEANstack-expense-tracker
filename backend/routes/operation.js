require('../config/passport')
const passport = require('passport')
const express = require('express');
const router = express.Router();
const controller = require('../controllers/operation.controller')
const { authenticate } = require('../middleware/auth');
const requireAuth = passport.authenticate('jwt', {
    session: false
})


router.post('/get-day-operations', requireAuth, authenticate, controller.getDayOperations);

router.post('/add-operation', requireAuth, authenticate, controller.addOperation)

router.post('/edit-operation', requireAuth, authenticate, controller.editOperation)

router.get('/remove-operation/:id', requireAuth, authenticate, controller.removeOperation)

router.post('/get-month-report', requireAuth, authenticate, controller.getMonthReport)

router.get('/get-statistics', requireAuth, authenticate, controller.getStatistics)

router.get('/get-account-summary', requireAuth, authenticate, controller.getAccountSummary)


module.exports = router;
