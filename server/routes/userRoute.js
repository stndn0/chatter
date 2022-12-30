const express = require("express");
const router = express.Router();

// Require controller modules
const user_controller = require('../controllers/userController');
const auth_controller = require('../controllers/authController');

router.get("/", (req, res) => {
    console.log("GET request to /user")
    res.json({ "message": "/user/" })
})

// Note the authentication middleware here. 
// We're essentially authenticating the user before fulfiling their request.
router.post("/updatebio", auth_controller.authenticateToken, (req, res) => {
    console.log("Server: Received request to /updatebio");
    user_controller.updateUserBio(req, res);
})

router.post("/newpost", auth_controller.authenticateToken, (req, res) => {
    console.log("Server: Received request to /newpost");
    user_controller.newPost(req, res);
})

router.post("/gettimelineposts", auth_controller.authenticateToken, (req ,res) => {
    console.log("Server: Received request to /gettimelineposts");
    user_controller.getTimelinePosts(req, res);
})

router.post("/followuser", auth_controller.authenticateToken, (req, res) => {
    console.log("Server: Received request to /followuser");
    user_controller.followUser(req, res);
})


// Route to display user profile.
// Note the route does not require authorization because user profiles are public.
router.get("/userpage/:id", function(req, res) {
    console.log("GET request to /userpage/id with ID:" + req.params.id)
    user_controller.getUserPage(req, res);
})


// Route to display a users post and the replies to that post.
// Note the route does not require authorization because user posts are public.
router.get("/fullpost/:postid", function(req, res) {
    console.log("GET request to /fullpost/postid with postid:" + req.params.postid);
    user_controller.getUserPost(req, res);
})





module.exports = router;


