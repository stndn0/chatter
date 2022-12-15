// server/index.js
require('dotenv').config();
const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 5000;
var bodyParser = require('body-parser')     // Parse POST requests (i.e. form data).

// We use mongoose to work with MongoDB
const mongoose = require('mongoose')
const connectDB = require('./config/dbConn');

// Connect to MongoDB
connectDB();

const app = express();
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
const authRoute = require('./routes/authentication')
app.use('/auth', authRoute);

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
