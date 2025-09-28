const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { auth, isAdmin } = require('../middleware/auth');

router.post(
    '/',
    auth,
    [
        body('property').notEmpty().withMessage('propertyId required'),
        body('checkIn').isISO8601().withMessage('valid checkIn date required'),
        body('checkOut').isISO8601().withMessage('valid checkOut date required'),
        body('totalPrice').isNumeric().withMessage('totalPrice required'),
    ],
    bookingController.createBooking
);

// current user's bookings
router.get('/my', auth, bookingController.getMyBookings);

// admin: all bookings
router.get('/', auth, isAdmin, bookingController.getAllBookings);

router.get('/:id', auth, bookingController.getBookingById);

module.exports = router;
