const express = require("express");
const router = express.Router();

// Require controller modules
const auth_controller = require('../controllers/authController');

router.post("/login", function (req, res) {
    console.log("Server: Recieved request to /auth.")
    auth_controller.verifyInput(req, res);
})

module.exports = router;