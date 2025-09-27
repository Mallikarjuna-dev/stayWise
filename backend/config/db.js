const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const db = await mongoose.connect(process.env.MONGO_URI);
        console.log(`mongodb connected: ${db.connection.host}`);
    } catch (error) {
        console.log(`mongodb connection error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
