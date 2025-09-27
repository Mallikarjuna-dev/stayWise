const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
        checkIn: { type: Date, required: true },
        checkOut: { type: Date, required: true },
        totalPrice: { type: Number, required: true },
        guests: { type: Number, default: 1 },
        status: { type: String, enum: ['booked', 'cancelled'], default: 'booked' },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
