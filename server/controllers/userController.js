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


exports.newPost = async (req, res, isStandalonePost = true, premadePostId) => {
    try {
        let date = new Date();
        let postid = crypto.randomBytes(5).toString('hex');

        // If a postid was not supplied to the function then generate one now.
        if (premadePostId != null) {
            postid = premadePostId;
        }

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
            isStandalonePost: isStandalonePost,
        }

        if (!isStandalonePost) {
            Object.assign(data, { replyingTo: req.body.postIDToReplyTo })
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

            let clientIsFollowing;

            // Check if the client is already following the profile.
            if (followers.includes(sender)) {
                // If client already following profile then unfollow the profile.
                let index = followers.indexOf(sender);
                followers.splice(index, 1);
                index = following.indexOf(userToFollow);
                following.splice(index, 1);
                clientIsFollowing = false;

            }
            else {
                // If client not following profile then follow the profile.
                followers.push(sender);
                following.push(userToFollow);
                clientIsFollowing = true;
            }

            // Update database
            const update = await User.updateOne({ userid: userToFollow }, { followers: followers }).exec();
            const update2 = await User.updateOne({ userid: sender }, { following: following }).exec();



            // Return to the client updated data about the profile for the user page
            const data = {
                username: userdb.username,
                userid: userdb.userid,
                userbio: userdb.bio,
                followers: userdb.followers,
                following: userdb.following,
                clientIsFollowing: clientIsFollowing
            }
            res.json({ user: data });


            console.log("sending: ", data.clientIsFollowing)
        }

        // Update the database
    } catch (error) {
        console.log(error)
    }
}

// Get data pertaining to a post and all posts that are replies to it.
exports.getUserPost = async (req, res) => {
    try {
        // Get the full post and it's author
        const postid = req.params.postid;
        const post = await Post.find({ postid: postid }).exec();
        const postAuthor = await User.findOne({ userid: post[0].userid }).exec();

        // The post object itself doesn't have a username (only a userid)
        // Lookup the userid attached to the post to find the author.
        // Attach the author to the post object and then return the object.
        Object.assign(post[0], { username: postAuthor.username })

        // Lookup the postids for all posts that are replies to this post
        const postReplies = post[0].replies;
        const replyPosts = [];

        for (let replyPostId of postReplies) {
            console.log(replyPostId)
            if (replyPostId != null) {
                // Lookup post in db. Append it to the array.
                // Lookup post username in db. Append it to the replyPost object.
                let replyPost = await Post.find({ postid: replyPostId }).exec();
                let replyPostUserId = replyPost[0].userid;
                let replyPostUser = await User.findOne({ userid: replyPostUserId }).exec();
                let username = replyPostUser.username;
                Object.assign(replyPost[0], { username: username })
                replyPosts.push(replyPost[0]);

                console.log("Fin iteration")
            }
        }


        console.log(replyPosts);
        res.json({ post: post[0], replyPosts: replyPosts });
    } catch (error) {
        console.log(error)
    }
}


exports.newReplyPost = async (req, res) => {
    try {
        console.log(req.body);
        const postid = req.body.postIDToReplyTo.trim();
        const reply = req.body.post.trim();

        console.log(reply.length)

        if (reply !== null && reply.length != 0 && reply != undefined && reply != "") {
            console.log("REPLY: ", reply);
            console.log("INSIDE IF. reply length is", reply.length)

            let post = await Post.find({ postid: postid }).exec();
            post = post[0];

            // Create a new post
            let postIdForNewPost = crypto.randomBytes(5).toString('hex');
            this.newPost(req, res, false, postIdForNewPost)

            // Append the postid of this new post to the replies array
            const replies = post.toJSON().replies;
            replies.push(postIdForNewPost);
            await Post.updateOne({ postid: postid }, { replies: replies }).exec();

            console.log("Fin")
            res.json({ "Server Response": "Success" })
        }
        else {
            res.json({ "Server Response": "Error when handling reply." })
        }


    } catch (error) {
        console.log(error)
        console.log("\nCould not reply to post. Probably an invalid reply string.")
    }
}
