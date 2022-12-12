const express = require("express");
const router = express.Router();

// Require controller modules
const auth_controller = require('../controllers/authController');

router.post("/login", function (req, res) {
    res.json({"message": "Auth Route Access"})
    console.log("Server: Recieved request to /auth.")
    console.log(req.body)
    auth_controller.verifyInput(req);
})

module.exports = router;