exports.verifyInput = (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;

        if (username.length < 3 || password.length < 3) {
            res.send("The server recieved invalid input.")
        }
        else {
            // Check the database to see if the username and password exist...
            res.send("User: " + username + " Password: " + password)
        }
    } catch (error) {
        console.log("Error when sending data from server (verifyInput)")
        console.log(error)
    }
}