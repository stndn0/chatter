const express = require("express");
const router = express.Router();

// Require controller modules
const user_controller = require('../controllers/userController');
const auth_controller = require('../controllers/authController');

router.get("/", (req, res) => {
    console.log("GET request to /user")
    res.json({ "message": "/user/" })
})

router.post("/updatebio", auth_controller.authenticateToken, (req, res)  => {
    console.log("Server: Received request to /updatebio");
    user_controller.updateUserBio(req, res);
})


function test(req, res, next) {
    console.log("middleware")
    next()
}


module.exports = router;


