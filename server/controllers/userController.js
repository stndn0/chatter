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


exports.getUserPage = async (req, res) => {
    try {
        const userid = req.params.id;
        const userdb = await User.findOne({ userid: userid }).exec();
        let userposts = await Post.find({ userid: userid }).sort({ _id: -1 }).exec();

        // Attach the username to each post
        for (let post of userposts) {
            Object.assign(post, { username: userdb.username })
        }

        const user = {
            username: userdb.username,
            userbio: userdb.bio,
            followers: userdb.followers,
            following: userdb.following
        }

        console.log(userposts)

        res.json({ user: user, posts: userposts });
    } catch (error) {
        console.log(error)
    }
}


exports.followUser = async (req, res) => {
    try {
        // Check to make sure the user isn't trying to follow themselves
        const sender = req.body.sender;
        const userToFollow = req.body.userToFollow;

        if (sender != userToFollow) {
            // Find the profile that this user wants to follow
            const userdb = await User.findOne({ userid: userToFollow }).exec();
            const followers = userdb.toJSON().followers;

            // Find the profile of the user that is requesting the follow
            const userdb2 = await User.findOne({ userid: sender }).exec();
            const following = userdb2.toJSON().following;

            // Check if the client is already following the profile.
            if (followers.includes(sender)) {
                // If client already following profile then unfollow the profile.
                let index = followers.indexOf(sender);
                followers.splice(index, 1);
                index = following.indexOf(userToFollow);
                following.splice(index, 1);

            }
            else {
                // If client not following profile then follow the profile.
                followers.push(sender);
                following.push(userToFollow);
            }

            console.log("Value of followers is ", followers)


            // Update database
            const update = await User.updateOne({ userid: userToFollow }, { followers: followers }).exec();
            const update2 = await User.updateOne({ userid: sender }, { following: following }).exec();


            // Update the 'following' array for this user with the id of the profile that they just followed
            // following.push(userToFollow);

            console.log("fin")
        }

        // Update the database
    } catch (error) {
        console.log(error)
    }
}