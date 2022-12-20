// Database models
const User = require('../models/User');
const Post = require('../models/Post');


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
        console.log(req.body);

        // To insert a document with *Mongoose* we use the create method.
        const update = await Post.create( {userid: req.body.userid, post: req.body.post} )

    } catch (error) {
        console.log(error)
    }
}