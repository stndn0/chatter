const User = require('../models/User');
const MIN_USERNAME_LENGTH = 3;
const MIN_PASSWORD_LENGTH = 3;
const jwt = require('jsonwebtoken');

const validUserInput = (username, password) => {
    if (username === null || password === null) {
        return false;
    }
    else if (username.length < MIN_USERNAME_LENGTH || password.length < MIN_PASSWORD_LENGTH) {
        return false;
    }
    return true;
}

exports.veryifyLoginInput = async (req, res) => {
    try {
        console.log(req.body)
        const username = req.body.username;
        const password = req.body.password;

        // After performing basic input checks, check the database to see if the username exists.
        if (validUserInput(username, password)) {
            const userExists = await User.findOne({ username: username }).exec() // Must use .exec() when using async/await.

            if (!userExists) {
                res.json({ "response": 403 });
            }
            else {
                // Authenticate user
                if (password !== userExists.password) {
                    res.json({ "response": 403 });
                }
                // Authorize user and return relevant information for the initial timeline load
                else {
                    const bio = userExists.bio;
                    const userid = userExists.toJSON().userid;      // NOTE: Must put .toJSON() to prevent weird "undefined" error!

                    // Create a JSON Access Token and a JSON Refresh Token.
                    // Serialize the user with a name and a secret key.
                    const accessToken = jwt.sign({ username: username }, process.env.ACCESS_TOKEN_SECRET);
                    // const accessToken = jwt.sign({username: username}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' });
                    const refreshToken = jwt.sign(username, process.env.REFRESH_TOKEN_SECRET);
                    res.json({
                        "Server Response": "Successful login",
                        "accessToken": accessToken,
                        "refreshToken": refreshToken,
                        "username": username,
                        "bio": bio,
                        "userid": userid,
                    });
                }
            }
        }

        // Invalid user input.
        else {
            res.json({ "response": 403 });
        }

    } catch (error) {
        console.log("\nServer recieved invalid POST data.")
        console.log(error, "\n\n****** end of error stream ******\n\n")
    }
}


// Middleware - authenticate user access token
// User token must be authenticated before a user is permitted to do anything
// that requires authorization (e.g view timeline, login...)
exports.authenticateToken = (req, res, next) => {
    try {
        // Parse incoming request from client. Read the header and verify the token.
        const authHeader = req.headers['authorization'];
        const token = authHeader.split(' ')[1];

        if (token == 'null') {
            console.log("Auth error. Invalid token.")
            return res.json({ "Server Response": "Unauthorized request." });
        }

        // Check token to see if it's valid.
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, username) => {
            // Remember that the 'username' variable has already been serialized 
            // in memory back when the login request was handled.

            // Case: server recieved an access token that is expired. 
            if (err) {
                // Ask client to send their refresh token so that the server can verify it.
                console.log("Token no longer valid. Requesting refresh token.")
                return res.json({ "Server Response": "Unauthorized. Your token is no longer valid." });
            }
            // Valid token
            else {
                // TODO - WATCH THIS (13:30) FOR RETURNING USER SPECIFIC DATA
                // https://www.youtube.com/watch?v=mbsmsi7l3r4&t=30s

                // console.log("Authorization successful for", username);
                // // Move on from the middleware
                // req.username = username;
                next();
                return;
            }
        })
    } catch (error) {
        return res.json({ "Server Response": "Unauthorized." });
    }

}