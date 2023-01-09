const User = require('../models/User');

// Used to generate random string
const crypto = require('crypto');


// Input validation helper function
const validUserInput = (username, password1, password2) => {
    if (username === null || password1 === null || password2 === null) {
        return false;
    }
    else if (username.length < 3 || password1.length < 3 || password2.length < 3) {
        return false;
    }
    else if (username.length > 20 || password1.length > 20 || password2.length > 20) {
        return false;
    }
    else if (password1 !== password2) {
        return false;
    }
    return true;
}

// Register a new user to the database
exports.verifyRegistrationInput = async (req, res) => {
    try {
        console.log(req.body)
        const username = req.body.username;
        const password1 = req.body.password1;
        const password2 = req.body.password2;

        // After performing basic input checks, check the database to see if the username is taken.
        if (validUserInput(username, password1, password2)) {
            // If the username is taken then 'duplicate' will store it's value.
            const duplicate = await User.findOne({ username: username }).exec(); // Need to put .exec() when using async/await.
            if (duplicate) {
                res.json({ "response": 403 });
            }

            // User does not exist in database. Register the user.
            else {
                // Create and store the user.
                const date = new Date().toJSON().slice(0, 10);
                let userid = crypto.randomBytes(5).toString('hex');
                const result = await User.create({
                    "username": username,
                    "password": password1,
                    "date": date,
                    "userid": userid,
                    "following": [],
                    "followers": [],
                    "avatar": "https://imgur.com/2lTANU7"
                })

                console.log(result)
                res.json({ "response": "Successful registration" });
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
