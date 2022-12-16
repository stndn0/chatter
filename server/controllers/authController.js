const User = require('../models/User');
const MIN_USERNAME_LENGTH = 3;
const MIN_PASSWORD_LENGTH = 3;
const jwt =  require('jsonwebtoken');

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
                res.json({ "Server Response": "Your username or password is incorrect." });
            }
            else {
                // Authenticate user
                if (password !== userExists.password) {
                    res.json({ "Server Response": "Your username or password is incorrect." });
                }
                // Authorize user
                else {
                    // Create a JSON Web Token
                    // Serialize the user with a name and a secret key.
                    jwt.sign = {username: username }
                    

                    res.json({ "Server Response": "You are now logged in..." });
                }
            }
        }

        // Invalid user input.
        else {
            res.json({ "Server Response": "Failed registration (invalid input)." });
        }

    } catch (error) {
        console.log("\nServer recieved invalid POST data.")
        console.log(error, "\n\n****** end of error stream ******\n\n")
    }
}

// exports.verifyRegistrationInput = (req, res) => {
//     console.log(req.body)
// }