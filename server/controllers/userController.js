const User = require('../models/User');
const { authenticateToken } = require("./authController")

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


exports.newTweet = async (req, res) => {
    try {
        
    } catch (error) {
        console.log(error)
    }
}