// These functions allow the client to communicate with the server by making
// requests to API endpoints.



export async function sendToServer(url, data) {
    const options = {
        method: 'POST',
        // Headers consist of meta data. We're telling the server that we're sending a JSON.
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }

    const response = await fetch(url, options);
    return response.json();
};

// export async function sendToServerAuthorized(url, accessToken) {
//     const authBody = 'Bearer ' + accessToken;

//     const options = {
//         method: 'GET',
//         // Headers consist of meta data. We're telling the server that we're sending a JSON.
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': authBody
//         },
//     }

//     const response = await fetch(url, options)
//     return response.json();
// }


// Authorized route
// Send updated user bio information to server endpoint
export async function setUserBio(accessToken, data) {
    const endpooint = "http://localhost:5000/user/updatebio";
    const authBody = 'Bearer ' + accessToken

    const options = {
        method: 'POST',
        // Headers consist of meta data. We're telling the server that we're sending a JSON.
        headers: {
            'Content-Type': 'application/json',
            'Authorization': authBody
        },
        body: JSON.stringify(data)
    }

    const response = await fetch(endpooint, options)
    return response.json();
}