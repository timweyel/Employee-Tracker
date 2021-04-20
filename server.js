const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');


const PORT = process.env.PORT || 3001;
const app = express();

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',node,
    // Your MySQL username,
    user: 'root',
    // Your MySQL password
    password: 'password',
    database: 'employee_tracker'
  },
  console.log('Connected to the employee_tracker database.')
);

app.get('/home', (req, res) => {
  res.json({
    message: 'Hello World'
  });
});


// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());



// Default response for any other request (Not Found)

app.use((req, res) => {
  res.status(404).end();
});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});