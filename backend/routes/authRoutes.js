const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');

// register
router.post(
    '/register',
    [
        body('name').trim().notEmpty().withMessage('Name required'),
        body('email').isEmail().withMessage('Valid email required'),
        body('password').isLength({ min: 6 }).withMessage('Password at least 6 chars'),
    ],
    authController.register
);

// login
router.post('/login', authController.login);

router.get('/me', auth, authController.me);

module.exports = router;
