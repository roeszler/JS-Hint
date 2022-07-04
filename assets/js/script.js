const API_KEY = "gnEL0w3DZBJeTYdH5wmTdZIV_Pc";
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal")); // Creates a modal with a single line of JavaScript

document.getElementById("status").addEventListener("click", event => getStatus(event)); // std event listener for check key (#status) button
document.getElementById("submit").addEventListener("click", event => postFrom(event)); // std event listener for run checks button (#submit)

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
        displayException(data); // presents data to the user before throwing the error
        throw new Error(data.error); // built in Error function, but data.error is the descriptive message from the JSON that is being returned
    }
}

// ---------- To display the error in a modal 

function displayStatus(data) {
    let heading = "API Key Status";
    let results = `<div>Your key is valid until</div>`;
    results += `<div class="key-status">${data.expiry}</div>`; // second div using template literals

    document.getElementById("resultsModalTitle").innerText = heading; // returns string of text within
    document.getElementById("results-content").innerHTML = results; // returns line of HTML code

    resultsModal.show();
}

function processOptions(form) {
    // 1. Iterate through options
    // 2. Push that into a temporary array
    // 3. Convert array back to a string

    let optArray = [];

    for (let entry of form.entries()) {
        if (entry[0] === "options") { // if the first key = "options",
            optArray.push(entry[1]); // then push the second value in each entry into my temporary array 
        };
    }
    form.delete("options"); // will delete all values of "options" in our data
    form.append("options", optArray.join()) // will append out new options in key:value pairs and join to convert it back to a string. This will append back a comma separated string of options to our form.
    return form;
}


// ------------ To add the run checks modal
async function postFrom(event) {
    // Js FormData interface: it can capture all of the fields in a HTML form and return it as an object. Give the object a fetch() and not do any other processing.
    const form = processOptions(new FormData(document.getElementById("checksform")));

    // for (let entry of form.entries()) { //  test will to iterate through each of the form entries putting it in 'entry'
    //     console.log(entry);
    // }

    // ------------ setting the authorization header for JavaScript
    // This will make a POST request to the API, authorize it with the API key, and attach the form as the body of the request.
    const response = await fetch(API_URL, { // need to 'await fetch' because it  returns a promise
        method: "POST", 
        headers: {
            "Authorization": API_KEY,
        },
        body: form, // send the 'form' data from above to the API
    });

    // Turn the response into JSON 
    const data = await response.json();

    if (response.ok) {
        // console.log(data);
        displayErrors(data);
    } else {
        displayException(data); // presents data to the user before throwing the error
        throw new Error(data.error);
    }
}

// To format and display the data or error thrown
// a little bit more complex this time because we need to iterate through the error list
function displayErrors(data) {

    let heading = `JSHint results for ${data.file}`; // picks up the 'file' name / value

    if (data.total_errors == 0) {
        results = `<div class="no_errors">No errors reported!</div>`;
    } else {
        results = `<div>Total errors: <span class="error_count">${data.total_errors}</span></div>`;
        for (let error of data.error_list) {
            results += `<div>At line <span class="line">${error.line}</span>, `;
            results += `column <span class="column">${error.col}</span></div>`;
            results += `<div class="error">${error.error}</div>`;
        }
    }
    // set the heading in the modal
    document.getElementById("resultsModalTitle").innerText = heading;
    // set the content in the modal
    document.getElementById("results-content").innerHTML = results;
    // display the modal
    resultsModal.show();
}

function displayException(data) {
    // in this format: {"error":"No or invalid API key","error_no":3,"status_code":403}
    let heading = `An Exception Occurred`; // modal header
    
    results = `<div>The API returned status code ${data.status_code}</div>`; // first line modal info
    results += `<div>Error number: <strong>${data.error_no}</strong></div>`; // second line modal info
    results += `<div>Error text: <strong>${data.error}</strong></div>`;

    document.getElementById("resultsModalTitle").innerText = heading; // updated the modal heading
    document.getElementById("results-content").innerHTML = results; // updates the modal information

    resultsModal.show(); // displays the modal with updated HTML & text.
}
