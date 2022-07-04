const API_KEY = "gnEL0w3DZBJeTYdH5wmTdZIV_Pc";
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal")); // Creates a modal with a single line of JavaScript

document.getElementById("status").addEventListener("click", event => getStatus(event)); // std event listener

/* 
Get Status function: 
1. Make a GET request to the API_URL using the API_KEY
2. Pass the data to a display function
*/

/*
When handling promises, we have two ways of doing it.
1. We can chain “.then’s as we did before, or 
2. We can wrap the promises in  an async function - like this:
*/
async function getStatus(event) {
    const queryString = `${API_URL}?api_key=${API_KEY}`; // produces https://ci-jshint.herokuapp.com/api?api_key=gnEL0w3DZBJeTYdH5wmTdZIV_Pc

    const response = await fetch(queryString); // awaiting a response from the server
    const data = await response.json(); // to convert the response into a data string. Also awaiting a second promise
    if (response.ok) {
        // console.log(data); // if response.ok is true
        // console.log("API expires on:", data.expiry, "Status:", data.status_code); // drills down to log date of expiry and status
        displayStatus(data);// to display the data in our modal
    } else { // throw an error if the response is not ok
        throw new Error(data.error); // built in Error function, but data.error is the descriptive message from the JSON that is being returned
    }
}


function displayStatus(data) {
    let heading = "API Key Status";
    let results = `<div>Your key is valid until</div>`;
    results += `<div class="key-status">${data.expiry}</div>`; // second div using template literals

    document.getElementById("resultsModalTitle").innerText = heading; // returns string of text within
    document.getElementById("results-content").innerHTML = results; // returns line of HTML code

    resultsModal.show();
}