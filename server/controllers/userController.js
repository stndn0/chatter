// Database models
const User = require('../models/User');
const Post = require('../models/Post');
// Used to generate random string
const crypto = require('crypto');
const { post } = require('../routes/userRoute');

exports.updateUserBio = async (req, res) => {
    try {
        // Update database
        const update = await User.updateOne({ userid: req.body.userid }, { bio: req.body.bio }).exec()
        console.log("User bio updated. ")

    } catch (error) {
        console.log(error)
        console.log("Error when updating user bio.")
    }
}


exports.newPost = async (req, res) => {
    try {
        let postid = crypto.randomBytes(5).toString('hex');
        let date = new Date();
        // let date = new Date().toLocaleDateString();
        // let time = new Date().toLocaleTimeString('en-US', { hour12: false })
        // let datetime = date + '-' + time;

        const data = {
            userid: req.body.userid,
            postid: postid,
            post: req.body.post,
            likes: 0,
            reposts: 0,
            date: date,
            // time: time,
            // datetime: datetime,
            replies: [],
            isStandalonePost: true,
        }

        console.log(data)

        // To insert a document with *Mongoose* we use the create method.
        const update = await Post.create(data)

    } catch (error) {
        console.log(error)
    }
}


exports.getTimelinePosts = async (req, res) => {
    try {
        console.log("Get timeline posts from db and return...");

        // Find who this user is following 
        const userid = req.body.userid
        const userdb = await User.findOne({ userid: userid }).exec();
        const following = userdb.toJSON().following;

        // Retrieve posts from whoever the user is following
        const timelinePosts = [];
        for (followedUserID of following) {
            // Get post data
            let followedUserPosts = await Post.find({ userid: followedUserID }).sort({ _id: -1 }).exec();

            timelinePosts.push(followedUserPosts);
        }

        // Get the users own posts
        const myPosts = await Post.find({ userid: userid }).sort({ _id: -1 }).exec();
        timelinePosts.push(myPosts);

        // Merge (1) followed posts and (2) user posts into a single array.
        const posts = []
        for (let array of timelinePosts) {
            for (let object of array) {
                posts.push(object)
            }
        }
        posts.sort((a, b) => new Date(b.date) - new Date(a.date))

        // Currently each post object in the array only has the userid and not the username
        // Retrieve the username and add it to each post object
        for (let post of posts) {
            let currentUser = await User.findOne({ userid: post.userid }).exec();
            let username = currentUser.toJSON().username;
            Object.assign(post, { username: username })
            console.log(post)
        }
        res.json({ "posts": posts })
        
    } catch (error) {
        console.log(error)
        console.log("Error")
    }
}