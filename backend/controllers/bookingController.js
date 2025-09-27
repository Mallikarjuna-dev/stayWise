const { validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const Property = require('../models/Property');

exports.createBooking = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    const { propertyId, checkIn, checkOut, guests } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    const ci = new Date(checkIn);
    const co = new Date(checkOut);
    if (co <= ci) return res.status(400).json({ message: 'checkOut must be after checkIn' });

    // basic pricing calculation:
    const nights = Math.ceil((co - ci) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * property.pricePerNight;

    const booking = await Booking.create({
        user: req.user._id,
        property: property._id,
        checkIn: ci,
        checkOut: co,
        guests: guests || 1,
        totalPrice,
    });

    res.status(201).json({ message: 'Booking created', booking });
};

exports.getMyBookings = async (req, res) => {
    const bookings = await Booking.find({ user: req.user._id }).populate('property').sort({ createdAt: -1 });
    res.json({ bookings });
};

exports.getAllBookings = async (req, res) => {
    // admin only
    const bookings = await Booking.find().populate('property user').sort({ createdAt: -1 });
    res.json({ bookings });
};

exports.getBookingById = async (req, res) => {
    const booking = await Booking.findById(req.params.id).populate('property user');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // allow admin OR the owner
    const isOwner = booking.user._id.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not allowed' });
    }
    res.json({ booking });
};

exports.cancelBooking = async (req, res) => {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const isOwner = booking.user.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not allowed' });
    }

    booking.status = 'cancelled';
    await booking.save();
    res.json({ message: 'Booking cancelled', booking });
};
