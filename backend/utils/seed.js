require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/User');
const Property = require('../models/Property');

const run = async () => {
    try {
        await connectDB();
        await User.deleteMany({});
        await Property.deleteMany({});

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash('Admin1234', salt);

        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@staywise.test',
            password: hashed,
            role: 'admin',
        });

        const sampleProps = [
            {
                title: 'Sunny Villa near Beach',
                description: 'A beautiful sunny villa within walking distance of the beach.',
                location: 'Goa, India',
                pricePerNight: 4500,
                images: [],
                amenities: ['Pool', 'WiFi', 'AC'],
                owner: admin._id,
            },
            {
                title: 'Hillside Cottage',
                description: 'Peaceful cottage on the slopes with panoramic views.',
                location: 'Ooty, India',
                pricePerNight: 3000,
                images: [],
                amenities: ['Fireplace', 'Kitchen', 'Parking'],
                owner: admin._id,
            },
        ];

        await Property.insertMany(sampleProps);

        console.log('Seed complete. Admin credentials: admin@staywise.test / Admin123!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

run();
