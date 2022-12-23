const mongoose = require('mongoose')
const Schema = mongoose.Schema;  

// Everything in Mongoose starts with a Schema.
// A schema maps to a MongoDB collection and defines the shape of the documents within that collection.


const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password : {
        type: String,
        required: true
    },
    date : {
        type: String,
        required: false
    },
    bio: {
        type: String,
        required: false
    },
    userid: {
        type: String,
        required: true
    },
    following: {
        type: Array,
        required: true
    },
    followers: {
        type: Array,
        required: true
    },
    refreshToken: String
})

module.exports = mongoose.model('User', userSchema)