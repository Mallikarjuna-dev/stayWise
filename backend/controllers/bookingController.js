const Booking = require("../models/Booking");
const Property = require("../models/Property");

// Create booking
exports.createBooking = async (req, res) => {
    try {
        const { propertyId, checkIn, checkOut, totalPrice, guests } = req.body;

        if (!propertyId || !checkIn || !checkOut || !totalPrice) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }

        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        if (isNaN(checkInDate) || isNaN(checkOutDate) || checkInDate >= checkOutDate) {
            return res.status(400).json({ message: "Invalid check-in or check-out dates" });
        }

        const booking = new Booking({
            user: req.user.id,
            property: propertyId,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            totalPrice,
            guests: guests || 1,
        });
        await booking.save();

        const populatedBooking = await Booking.findById(booking._id)
            .populate("property", "title location pricePerNight")
            .populate("user", "email");

        res.status(201).json(populatedBooking);
    } catch (err) {
        console.error("Booking creation error:", err);
        res.status(500).json({ message: err.message });
    }
};

// Current user's bookings
exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user.id })
            .populate("property", "title location pricePerNight")
            .populate("user", "email");

        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Admin: all bookings
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("property", "title location pricePerNight")
            .populate("user", "email");

        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get booking by ID
exports.getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate("property", "title location pricePerNight")
            .populate("user", "email");

        if (!booking) return res.status(404).json({ message: "Booking not found" });

        if (req.user.role !== "admin" && booking.user._id.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        res.json(booking);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
