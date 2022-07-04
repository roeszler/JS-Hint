Usage Instructions
Registration
An API key is required to use this service. To register for an API key, input your email address in the field above. If you are a current student of Code Institute, you will be issued with a key. All keys expire after 12 months.

If you forget your API key, you can enter your email address again and it will be emailed to you.

POST
POST your data to the endpoint. The API currently lives at https://ci-jshint.herokuapp.com/api

This API accepts the following parameters:

code - the JavaScript code you want to check...or
url - the URL to a JavaScript file that you want to check
filename - a text field containing the name of the file you are checking. Optional if you're passing in a URL
options - a comma separated list of options, which are outlined below. These options are optional...as the name suggests

The API key must be passed in the headers. Here is an example of setting the header for JavaScript:

```
const response = fetch("https://ci-jshint.herokuapp.com/api", {
                        method: "POST",
                        headers: {
                                    "Authorization": API_KEY,
                                 }
                        })
```           
Options
esX - where X is a number: 3,5,6,7,8,9 or 10. This declares what JavaScript version we're checking. Some newer features, like arrow functions, came with ES6.
harsh - switches on a whole host of restrictive settings, such as enforcing triple equals signs, forcing curly braces around single line code blocks, forcing a trailing comma in objects
relax - the opposite of strict! Allows functions in loops and doesn't care about semicolons
strict - expects "use strict"; at the top of the code and lints accordingly
jquery - switches on jQuery mode so that this code can be checked

GET
If you make a GET request to the /api endpoint, you need to supply the API key as a GET parameter, like so:

https://ci-jshint.herokuapp.com/api?api_key=thisismykey

If a valid key has been provided, the result will provide the expiry date for the key:

```{"expiry":"11-02-2022","status_code":200}```

Otherwise an error will be thrown.

Output
The returned data from a POST request looks something like this:

```
{
    "error_list": [
        {
            "col": 20,
            "error": "['value'] is better written in dot notation.",
            "flag": "(error)",
            "line": 18
        },
        {
            "col": 33,
            "error": "Functions declared within loops referencing an outer scoped variable may lead to confusing semantics.
            (window)",
            "flag": "(error)",
            "line": 49
        },
        {
            "col": 37,
            "error": "Functions declared within loops referencing an outer scoped variable may lead to confusing semantics.
            (getCurrentSelected)",
            "flag": "(error)",
            "line": 54
        },
        {
            "col": 7,
            "error": "Missing semicolon.",
            "flag": "(error)",
            "line": 57
        }
    ],
    "file": "menu.js",
    "status_code": 200,
    "total_errors": 4
}
```
            
The error_list array consists of the line and column where the error happened and the error text. It also has a flag field, which contains the error ID. It seems that JSHint doesn't distinguish between errors and warnings yet but, when it does, we're ready with this field.

The fields are the filename, HTTP status code, and error count.

Exceptions
Exceptions occur when the API encounters an error processing your request.

Exceptions are provided in this format:

`{"error":"No or invalid API key","error_no":3,"status_code":403}`

error is the descriptive text of the exception that occurred error_no is the internal error code number status_code is the HTTP status code that maps to the error

The API also exits with either 200 or the appropriate status code, so you can catch it if you want.