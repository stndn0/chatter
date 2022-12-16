const express = require("express");
const router = express.Router();

// Require controller modules
const auth_controller = require('../controllers/authController');
const register_controller = require('../controllers/registerController');

// Test route
router.get("/", (req, res) => {
    console.log("GET request to /auth")
    res.json({ "message": "/auth/" })
})

router.post("/login", function (req, res) {
    console.log("Server: Recieved request to /auth.")
    auth_controller.veryifyLoginInput(req, res);
})

router.post("/register", function (req, res) {
    console.log("Server: Recieved request to /register.");
    register_controller.verifyRegistrationInput(req, res);
})

module.exports = router;