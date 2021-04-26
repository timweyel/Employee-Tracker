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
    console.log({res});
    console.log({err});
    return;
  } else {
  console.log(`Connected to the ${db.config.database} database.`);
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
        "Add Role",
        "Add Employee",
        "Update Employee Role",
        "Exit"
      ]
    })
    .then(function(res) {
      switch (res.choice){
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

      case "Add Employee":
        addEmployee();
        break;

      case "Update Employee Role":
        updateEmployeeRole();
        break;

      case 'Exit':
        db.end();
        break;
     }

    }).catch((err) => {
      if(err) {
        throw err;
      }
      });
}


// VIEW ALL DEPARMENTS
function viewAllDepartments() {
  const sql = `SELECT id, name AS Department FROM department ORDER BY id ASC`;

  db.query(sql, (err, res) => {
    if (err) {
      console.log({ res });
      console.log({ err });
      return;
    }
    console.log("All Departments:");
    console.table(res);
    startEmployeeTracker();
  });
}

// VIEW ALL ROLES
function viewAllRoles() {
  const sql = `SELECT role.title AS Job_Title,
  role.id AS ID,
  department.name AS Department,
  role.salary AS Salary
  FROM role LEFT JOIN department
  ON department_id = department.id;`;

  db.query(sql, (err, res) => {
    if (err) {
      console.log({res});
      console.log({err});
      return;
    }
    console.log("All Roles:");
    console.table(res);
    startEmployeeTracker();
  });
};

// VIEW ALL EMPLOYEES
function viewAllEmployees() {
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
      console.log({res});
      console.log({err});
      return;
    }
    console.log("All Employees:");
    console.table(res);
    startEmployeeTracker();
  });
};

// ADD DEPARTMENT
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

        console.log({res});
        console.log({err});
        //addDepartment();
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
  const departmentsSQL = `SELECT name FROM department`;
  let departments = [];

  db.query(departmentsSQL, (err, res) => {
    if (err) {
      console.log(err);
    }
    res.forEach(departmentsSQL => {
      departments.push(departmentsSQL.name);
    })
  });

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
          message: "Select Department Name:",
          type: "list",
          name: "department",
          choices: departments
      }
    ]).then(res=> {
      const sql = `INSERT INTO role(title, salary, department_id)
      VALUES
      ("${res.title}",
      "${res.salary}",
      (SELECT id FROM department WHERE name = "${res.department}"));`

      db.query(sql, [{ title: res.title, salary: res.salary, department: res.department }], (err, results) => { // if this doesnt work use role as 2nd argument instead of [{title: res....

        if(err) {
          console.log({res});
          console.log({err});
          //addRole();
          return;
        }
      })
      console.log('Role added successfully!');
      viewAllRoles();
      startEmployeeTracker();
  });
}


// ADD EMPLOYEE
function addEmployee() {
  const roleSQL = `SELECT title FROM role`;
  let rolesArray = [];

  db.query(roleSQL, (err, res) => {
    if (err) {
      console.log(err);
    }
    res.forEach(role => {
      rolesArray.push(role.title);
    })
  });

  const managerSQL = `SELECT first_name, last_name FROM employee`;
  let employeesArray = [];

  db.query(managerSQL, (err, res) => {
    if(err) {
        console.log(err);
    }
    res.forEach( manager => {
        const fullName = `${manager.first_name} ${manager.last_name}`
        employeesArray.push(fullName);
    })
  });


  inquirer.
    prompt([
      {
          message: "Enter their first name:",
          type: "input",
          name: "first"
      },
      {
          message: "Enter their last name:",
          type: "input",
          name: "last"
      },
      {
          message: "What is their role?",
          type: "list",
          name: "role",
          choices: rolesArray
      },
      {
          message: "Select their manager:",
          type: "list",
          name: "manager",
          choices: employeesArray
      }
  ]).then((res) => {

    const sql = `INSERT INTO employee(first_name, last_name, role_id, manager_id)
    VALUES
      ("${res.first}", "${res.last}", (SELECT id FROM role WHERE title = "${res.role}" ), (SELECT id FROM (SELECT id FROM employee WHERE CONCAT(first_name," ",last_name) = "${res.manager}" ) AS tmptable))`;

    db.query(sql, [{first_name: res.first, last_name: res.last, role: res.role, manager_id: res.manager}], (err, results) => {
      if(err) {
        console.log({res})
        console.log({err})
        addEmployee();
        return;
      }

    })
    console.log('Employee added successfully!');
    viewAllEmployees();
    startEmployeeTracker();
  });
}

//UPDATE EMPLOYEE ROLE
function updateEmployeeRole(){
  const sql = `SELECT
                  employee.id,
                  employee.first_name,
                  employee.last_name,
                  role.title,
                  department.name,
                  role.salary,
                  CONCAT(manager.first_name, ' ', manager.last_name) AS manager
              FROM employee
              JOIN role
                  ON employee.role_id = role.id
              JOIN department
                  ON department.id = role.department_id
              JOIN employee manager
                  ON manager.id = employee.manager_id`;

  db.query(sql,(err, res)=>{
    if(err) {
      console.log({res})
      console.log({err})
    }
    const employee = res.map(({ id, first_name, last_name }) => ({
      value: id,
      name: `${first_name} ${last_name}`
    }));
    console.table(res);
    updateRole(employee);
  });
}

function updateRole(employee){
  const sql = `SELECT 
    role.id,
    role.title,
    role.salary
    FROM role`;

  db.query(sql,(err, res)=>{
    if(err) {
      console.log({res})
      console.log({err})
    }
    const roleChoices = res.map(({ id, title, salary }) => ({
      value: id,
      title: `${title}`,
      salary: `${salary}`
    }));
    console.table(res);
    getUpdatedRole(employee, roleChoices);
  });
}

function getUpdatedRole(employee, roleChoices) {
  inquirer
    .prompt([
      {
        type: "list",
        name: "employee",
        message: `Which employee has a new role? `,
        choices: employee
      },
      {
        type: "list",
        name: "role",
        message: "Select a new role: ",
        choices: roleChoices
      },

    ]).then((res)=>{
      const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;

      db.query(sql, [ res.role, res.employee ],(err, res)=>{
        if(err) {
          console.log({res})
          console.log({err})
        }
        console.log('Employee role updated successfully!')
        viewAllEmployees();
        startEmployeeTracker();
      });
    });
}