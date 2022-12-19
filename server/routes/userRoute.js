const express = require("express");
const router = express.Router();

// Require controller modules
const user_controller = require('../controllers/userController')

router.get("/", (req, res) => {
    console.log("GET request to /user")
    res.json({ "message": "/user/" })
})

router.post("/updatebio", function (req, res) {
    console.log("Server: Received request to /updatebio");
    user_controller.updateUserBio(req, res);
})

module.exports = router;