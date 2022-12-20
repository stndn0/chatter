// Database models
const User = require('../models/User');
const Post = require('../models/Post');
// Used to generate random string
const crypto = require('crypto')        

exports.updateUserBio = async (req, res) => {
    try {
        // Update database
        const update = await User.updateOne({ userid: req.body.userid }, {bio : req.body.bio}).exec()
        console.log("User bio updated. ")

    } catch (error) {
        console.log(error)
        console.log("Error when updating user bio.")
    }
}


exports.newPost = async (req, res) => {
    try {
        let postid = crypto.randomBytes(5).toString('hex');
        let date = new Date().toLocaleDateString();
        let time = new Date().toLocaleTimeString('en-US', {hour12: false})


        const data = {
            userid: req.body.userid, 
            postid: postid,
            post: req.body.post,
            likes: 0,
            reposts: 0,
            date: date,
            time: time
        }

        console.log(data)

        // To insert a document with *Mongoose* we use the create method.
        // const update = await Post.create( {userid: req.body.userid, post: req.body.post} )

    } catch (error) {
        console.log(error)
    }
}