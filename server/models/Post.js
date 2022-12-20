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
    time: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Post', postSchema)