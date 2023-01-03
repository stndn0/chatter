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

// Route that lets a user reply to a post
router.post("/newreplypost", auth_controller.authenticateToken, (req, res) => {
    console.log("POST request to /newreplypost");
    user_controller.newReplyPost(req, res);
})


// Route that returns page data for the user settings page.
router.post("/settingspage", auth_controller.authenticateToken, (req, res) => {
    console.log("POST request to /settingspage");
    user_controller.getSettingsPageData(req, res);
})


router.post('/setavatar', auth_controller.authenticateToken, (req, res) => {
    console.log("POST request to /setavatar");
    user_controller.setAvatar(req, res);
})

// Route that gets all replies to a post.
// Note the route does not require authorization because user replies are public.
// router.get("/replies/:postid", function(req, res) {
//     console.log("GET request to /replies/postid with postid:" + req.params.postid);
//     user_controller.getPostReplies(req, res);
// })




module.exports = router;


