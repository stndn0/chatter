exports.verifyInput = (req, res) => {
    try {
        console.log("GOT POST")
        console.log(req.body)

        const username = req.body.username;
        const password = req.body.password;

        if (username === null || password === null) {
            res.json({"message": "Server recieved invalid input."})
        }
        else if (username.length < 3 || password.length < 3) {
            res.json({"message": "Server recieved invalid input."})
        }
        else {
            // Check the database to see if the username and password exist...
            res.json({"username": req.body.username, "password": req.body.password})
            // res.send("User: " + username + " Password: " + password)
        }
    } catch (error) {
        console.log("Error when sending data from server (verifyInput)")
        console.log(error)
    }
}

// exports.verifyRegistrationInput = (req, res) => {
//     console.log(req.body)
// }