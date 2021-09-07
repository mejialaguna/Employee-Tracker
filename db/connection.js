// require sql package to connect database
const mysql = require("mysql2");

// Connect to database
const connection = mysql.createConnection(
  {
    host: "localhost",
    // your MYSQL username
    user: "root",
    // your mysql password
    password: "1234567",
    database: "institution",
  },
  console.log("connected to the institution database")
);

module.exports = connection ;