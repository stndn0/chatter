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