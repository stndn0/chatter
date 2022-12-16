const User = require('../models/User');
// todo - hash user password with bcrypt

// Register a new user to the database
exports.verifyRegistrationInput = async (req, res) => {
    console.log(req.body)

    const username = req.body.username;
    const password1 = req.body.password1;
    const password2 = req.body.password2;

    // Perform input checking
    if (username === null || password1 === null || password2 === null) {
        res.json({ "Server Response": "Invalid registration input" });
    }
    else if (username.length < 3 || password1.length < 3 || password2.length < 3) {
        res.json({ "Server Response": "Invalid registration input" });
    }
    else if (password1 !== password2) {
        res.json({ "Server Response": "Invalid registration input" });
    }

    // All checks sucessfully passed (valid username and password)
    else {
        // Returns a user that matches the username that we pass in.
        const duplicate = await User.findOne({ username: username }).exec(); // Need to put .exec() when using async/await
        // Fail. User exists in database.
        if (duplicate) {
            console.log("Server: Failed registration (user already exists in database)")
            res.json({ "Server Response": "Failed registration (user already exists in database)" });
            // return res.sendStatus(409)  // Conflict
        }

        // User does not exist in database. Register the user.
        else {
            const date = new Date().toJSON().slice(0, 10);

            // Create and store the user.
            const result = await User.create({
                "username": username,
                "password": password1,
                "date": date
            })

            console.log(result)

            console.log("Server: Successful registration");
            res.json({ "Server Response": "Successful registration" });
        }


    }
}
