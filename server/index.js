// server/index.js
require('dotenv').config();
const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 5000;
var bodyParser = require('body-parser')     // Parse POST requests (i.e. form data).

// We use mongoose to work with MongoDB
const mongoose = require('mongoose')
const connectDB = require('./config/dbConn');
mongoose.set('strictQuery', false);

// Connect to MongoDB
connectDB();

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(cors())

// Basic middleware to log requests
const requestLogger = (req, res, next) => {
  console.log("\n\n*** SERVER received", req.method + " request. ***\n");
  next();

  console.log("\n*** END. ***\n\n")
}
app.use(requestLogger)

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// Routes
const authRoute = require('./routes/authentication');
const userRoute = require('./routes/userRoute');
app.use('/auth', authRoute);
app.use('/user', userRoute);

// Respond to calls from React front-end
app.get("/api", (req, res) => {
  console.log("Server: Recieved request to /api")
  res.json({ "message": "Hello React from server!" })
})

// Only listen to requests once we're sucessfully connected to MongoDB.
mongoose.connection.once('open', () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });
})
