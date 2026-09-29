// import express application from backend/app.js
const MyApp = require("./backend/app");

// listen to requests from HttpClient (Angular)
// Express Application will running on port 3000
//the express server: http://localhost:3000
MyApp.listen(3000 , () => {
    console.log("Express Application is running on port 3000");
});