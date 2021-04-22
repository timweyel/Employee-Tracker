const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

const PORT = process.env.PORT || 3001;
const app = express();

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // Your MySQL username,
    user: 'root',
    // Your MySQL password
    password: 'password',
    database: 'employee_tracker'    
  }
);

db.connect(function(err) {
  if (err) { 
    throw err;
  } else {
    //console.log(db);
  console.log(`Connected to the ${db.config.database} database.`)
  startEmployeeTracker();
  }
});

function startEmployeeTracker() {
  inquirer
    .prompt({
      type: "list",
      name: "choice",
      message: "Select a view:",
      choices: [
        "View All Departments",
        "View All Roles",
        "View All Employees"
      ]
    })
    .then(function(val) {
      switch (val.choice){
      case "View All Departments":
        viewAllDepartments();
        break;
      
      case "View All Roles":
        viewAllRoles();
        break;

      case "View All Employees":
        viewAllEmployees();
        break;
    }
    });
}


// View All Departments
function viewAllDepartments() {
  console.log("All Departments");

  const sql = `SELECT id, name AS Department FROM department`;

  db.query(sql, (err, res) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    console.table(res);
    startEmployeeTracker();
  }); 
};

// // View All Roles
function viewAllRoles() {
  console.log("All Roles");

  const sql = `SELECT role.title AS Job_Title, 
  role.id AS ID, 
  department.name AS Department,
  role.salary AS Salary 
  FROM role LEFT JOIN department 
  ON department_id = department.id;`;

  db.query(sql, (err, res) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    console.table(res);
    startEmployeeTracker();
  }); 
};

// View All Employees
function viewAllEmployees() {
  console.log("All Employees");

  const sql = `SELECT 
      employee.id, 
      employee.first_name, 
      employee.last_name, 
      role.title, 
      department.name AS department, 
      role.salary, 
      CONCAT(manager.first_name, ' ', manager.last_name) AS manager,
      employee.manager_id
    FROM employee
    LEFT JOIN role
      ON employee.role_id = role.id
    LEFT JOIN department
      ON department.id = role.department_id
    LEFT JOIN employee manager
      ON manager.id = employee.manager_id`;

  db.query(sql, (err, res) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    console.table(res);
    startEmployeeTracker();
  }); 
};