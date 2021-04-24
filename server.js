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
  console.log(`Connected to the ${db.config.database} database.`)
  startEmployeeTracker();
  }
});

function startEmployeeTracker() {
  inquirer
    .prompt({
      type: "list",
      name: "choice",
      message: "What would you like to do?",
      choices: [
        "View All Departments",
        "View All Roles",
        "View All Employees",
        "Add Department",
        "Add Role"
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

      case "Add Department":
        addDepartment();
        break;

      case "Add Role":
        addRole();
        break;
      
     }
    });
}


// View All Departments
function viewAllDepartments() {
  console.log("All Departments");

  const sql = `SELECT id, name AS Department FROM department ORDER BY id ASC`;

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
      CONCAT(manager.first_name, ' ', manager.last_name) AS manager
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

function addDepartment(){
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "Enter the Department Name: "
      }
    ]).then((res) => {
    const sql = `INSERT INTO department SET ?`;
    db.query(sql, [{name: res.name}], (err, res) => {
      //TODO: try to put in some error handling here. add UNIQUE to schema. see error function below this function
      if(err) {
        
        console.log({res})
        console.log({err})
        return;
      }
      console.log('Department added successfully!');
      viewAllDepartments();
      startEmployeeTracker();
    });
  });
}

// function deptExistsException(msg) {
//   this.msg = msg;
//   this.name = 'deptExistsException';
// }

function addRole() {
  inquirer
    .prompt([
      {
          message: "Enter Title:",
          type: "input",
          name: "title"
      }, 
      {
          message: "Enter Salary:",
          type: "number",
          name: "salary"
      }, 
      {
          message: "Enter Department Name:",
          type: "number",
          name: "department"
      }

      // “INSERT INTO employee SET ?“, title, salary, department_id);

    ]).then(res=> {
      let sql = `INSERT INTO role(title, salary, department_id) 
      VALUES
      ("${res.title}", 
      "${res.salary}", 
      (SELECT id FROM department WHERE name = "${res.department}"));`
      console.log(res);
      console.log("res.title: ", res.title);
      console.log("res.salary: ", res.salary);
      console.log("res.department: ", res.department);
      db.query(sql, [{ title: res.title, salary: res.salary, department: res.department }], (err, results) => { // if this doesnt work use role as 2nd argument instead of [{title: res....
      //console.log(res)
      if(err) {
        
        console.log({res})
        console.log({err})
        return;
      } 
          else {
          console.log('Role added successfully!');//HERE
          }
      })
     console.log('Role added successfully!');//move this
     viewAllRoles();
     startEmployeeTracker();
  });
}

// function addEmployee() {
//   inquirer.
//     prompt([
//       {
//           message: "Enter their first name:",
//           type: "input",
//           name: "first"
//       }, 
//       {
//           message: "Enter their last name:",
//           type: "input",
//           name: "last"
//       }, 
//       {
//           message: "Enter their manager's first and last name:",
//           type: "input",
//           name: "manager"
//       }
//   ]).then((res) => {
//     const sql = `INSERT INTO role (first, last, manager) SET (?, ?, ?)`;
//     console.log(res);
//     db.query(sql, [{first_Name: res.first, last_Name: res.last, manager_id: res.manager}], (err, res) => {
//       if(err) {
//         res.status(500).json({ error: err.message });
//         return;
//       }
//     })
//     console.log('Role added successfully!');
//     viewAllEmployees();
//     startEmployeeTracker();
//   });
// }