const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const postSchema = new Schema({
    userid: {
        type: String,
        required: true
    },
    postid: {
        type: String,
        required: true
    },
    post: {
        type: String,
        required: true
    },
    likes: {
        type: String,
        required: true
    },
    reposts: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    // time: {
    //     type: String,
    //     required: true
    // },
    // datetime: {
    //     type: String,
    //     required: true
    // },
    // Array of postids
    replies: {
        type: Array,
        required: true
    },
    // Is this a standalone post or is this post a reply to someone else?
    isStandalonePost: {
        type: Boolean,
        required: true
    },
    // If this post is a response to someone else then store the postID of the other post.
    replyingTo: {
        type: String,
        required: false
    }
})

module.exports = mongoose.model('Post', postSchema)