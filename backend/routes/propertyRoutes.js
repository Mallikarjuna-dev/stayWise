const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const { auth, isAdmin } = require('../middleware/auth');

// public listing
router.get('/', propertyController.getProperties);
router.get('/:id', propertyController.getProperty);

// admin protected routes
router.post(
    '/',
    auth,
    isAdmin,
    [
        body('title').notEmpty().withMessage('Title required'),
        body('pricePerNight').isNumeric().withMessage('pricePerNight numeric required'),
    ],
    propertyController.createProperty
);

module.exports = router;
