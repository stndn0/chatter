const mongoose = require('mongoose')
const Schema = mongoose.Schema;  

const postSchema = new Schema({
    userid: {
        type: String,
        required: true
    },
    post: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Post', postSchema)