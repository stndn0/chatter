// We use mongoose to work with MongoDB
const mongoose = require('mongoose')

// Async function because we don't know how long it'll take
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
    } catch (error) {
        console.error(error);
    }
}

module.exports = connectDB;