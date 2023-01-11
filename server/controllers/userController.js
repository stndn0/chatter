// Database models
const User = require('../models/User');
const Post = require('../models/Post');
// Used to generate random string
const crypto = require('crypto');
const { post } = require('../routes/userRoute');
const { getAvatars } = require('../models/Avatars');

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
            likedby: [],
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
        const update = await Post.create(data);
        return res.json({ "response": 200 });



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
            let followedUserPosts = await Post.find({ userid: followedUserID }).sort({ _id: -1 }).lean().exec();

            timelinePosts.push(followedUserPosts);
        }

        // Get the users own posts
        // IMPORTANT! Must call lean() if you want to add stuff to objects.
        // See https://stackoverflow.com/questions/18554350/unable-to-add-properties-to-js-object
        const myPosts = await Post.find({ userid: userid }).sort({ _id: -1 }).lean().exec();
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
            let avatar = currentUser.toJSON().avatar;
            Object.assign(post, { username: username, avatar: avatar })
        }

        // console.log("Timeline Posts", posts)

        res.json({ "posts": posts })

    } catch (error) {
        console.log(error)
        console.log("Error")
    }
}


exports.getUserPage = async (req, res) => {
    try {
        const userid = req.params.id;
        const userdb = await User.findOne({ userid: userid }).lean().exec();
        let userposts = await Post.find({ userid: userid }).sort({ _id: -1 }).lean().exec();

        // Attach the username to each post
        for (let post of userposts) {
            Object.assign(post, { username: userdb.username, avatar: userdb.avatar })
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
        const post = await Post.find({ postid: postid }).lean().exec();
        const postAuthor = await User.findOne({ userid: post[0].userid }).lean().exec();

        console.log("DEBUG: Post id is ", postid);

        // The post object itself doesn't have a username (only a userid)
        // Lookup the userid attached to the post to find the author.
        // Attach the author to the post object and then return the object.
        Object.assign(post[0], { username: postAuthor.username, avatar: postAuthor.avatar })

        // Lookup the postids for all posts that are replies to this post
        const postReplies = post[0].replies;
        const replyPosts = [];

        for (let replyPostId of postReplies) {
            console.log("DEBUG: replyPostId: ", replyPostId)
            if (replyPostId != null) {
                // Lookup post in db. Append it to the array.
                // Lookup post username in db. Append it to the replyPost object.
                let replyPost = await Post.find({ postid: replyPostId }).lean().exec();
                console.log("DEBUG: reply post is", replyPost)
                let replyPostUserId = replyPost[0].userid;
                let replyPostUser = await User.findOne({ userid: replyPostUserId }).lean().exec();
                let username = replyPostUser.username;
                let avatar = replyPostUser.avatar;
                Object.assign(replyPost[0], { username: username, avatar: avatar })
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
        }
        else {
            res.json({ "Server Response": "Error when handling reply." })
        }


    } catch (error) {
        console.log(error)
        console.log("\nCould not reply to post. Probably an invalid reply string.")
    }
}


exports.likePost = async (req, res) => {
    // https://www.tutorialsteacher.com/mongodb/update-arrays
    try {
        // Load database document for this post
        const userid = req.body.userid;     // user who is doing the liking
        const postid = req.body.postid;     // the post the user wants to like
        const post = await Post.find({ postid: postid }).exec();

        // Check if user has already liked post.
        if (post[0].likedby.includes(userid)) {
            // Remove userid from likedby
            await Post.updateOne({ postid: postid }, { $pull: { "likedby": userid } })

            // Decrement liked count. 
            await Post.updateOne({ postid: postid }, { $inc: { likes: -1 } })
            console.log(userid, "has unliked post", postid)

        }
        else if (!post[0].likedby.includes(userid)) {
            // Push userid to likedBy
            await Post.updateOne({ postid: postid }, { $push: { "likedby": userid } })

            // Increment liked count. 
            await Post.updateOne({ postid: postid }, { $inc: { likes: 1 } })
            console.log(userid, "has liked post", postid)
        }

        // If user has already liked post, decrement like count and update likedBy

        // If user has not liked post, increment like count and updated likedBy

        return res.json({ "response": 200 })

    } catch (error) {
        console.log(error)
    }
}



exports.getSettingsPageData = async (req, res) => {
    res.json({ avatars: getAvatars() })
}

exports.setAvatar = async (req, res) => {
    try {
        const avatarSelection = req.body.currentAvatarSelection;
        const avatars = getAvatars();
        const avatarUrl = avatars[avatarSelection];

        // Set the avatar on the database
        await User.updateOne({ userid: req.body.userid }, { avatar: avatarUrl }).exec();

    } catch (error) {
        console.log(error)
    }
    console.log("Set avatar logic...", req.body)
}

exports.updateUsername = async (req, res) => {
    try {
        const userid = req.body.userid;
        const newusername = req.body.username;

        if (newusername != null && newusername.length >= 3 && newusername.length < 20 && newusername != undefined) {
            // Update username
            await User.updateOne({ userid: userid }, { username: newusername }).exec();
            return res.json({ "response": 200, "newusername": newusername })
        }
        else {
            return res.json({ "response": 400 })
        }

    } catch (error) {
        console.log(error)
    }
}


exports.updatePassword = async (req, res) => {
    try {
        const userid = req.body.userid;
        const pass1 = req.body.password1;
        const pass2 = req.body.password2;

        if (pass1.length > 3 && pass2.length > 3 && pass1 != null && pass2 != null) {
            if (pass1 === pass2 && pass1.length < 20 && pass2.length < 20) {
                // Update password
                await User.updateOne({ userid: userid }, { password: pass1 }).exec();
                return res.json({ "response": 200 });
            }
            else {
                return res.json({ "response": 400 });
            }
        }
        else {
            return res.json({ "response": 400 });
        }


    } catch (error) {
        console.log(error)
    }
}


exports.deletePost = async (req, res) => {
    try {
        const clientuserid = req.body.clientuserid;
        const postid = req.body.postid;

        console.log(clientuserid, postid)

        // First check if the post was actually made by the requesting clientid
        const post = await Post.find({ postid: postid }).exec();

        if (post[0].userid === clientuserid) {
            // If the post was a reply to someone elses post, we need to access the other persons post
            // and delete this postid from that post
            if (!post.isStandalonePost) {
                await Post.update( { postid: post[0].replyingTo}, {$pull: {replies: postid}}).exec();
                console.log("Deleted")
            }

            await Post.deleteOne({ postid: postid }).exec();

            return res.json({ "response": 200 });
        }
        else {
            console.log("Unauthorized deletion request.")
            return res.json({ "response": 400 });
        }

    } catch (error) {
        return res.json({ "response": 400 });
    }
}