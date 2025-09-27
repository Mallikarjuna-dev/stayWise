const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

const generateToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
};

exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashed });
    const token = generateToken(user);

    res.status(201).json({
        message: 'Registered successfully',
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
        token,
    });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(user);
    res.json({
        message: 'Login successful',
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
        token,
    });
};

exports.me = async (req, res) => {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
    res.json({ user: req.user });
};
