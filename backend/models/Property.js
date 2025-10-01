const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String },
        location: { type: String },
        pricePerNight: { type: Number, required: true },
        images: [{ type: String }], // store image URLs
        amenities: [{ type: String }],
        owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // optional
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Property', propertySchema);
