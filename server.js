var inquirer = require("inquirer");
const { query } = require("./db/connection");
const connection = require("./db/connection");

function todoList() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "todo",
        message: "Hello there , What would you like to do",
        choices: [
          "add employee",
          "view all employees",
          "view all employees by manager",
          "view all employee by department",
          "update role",
          "update employee manager",
          "delete employee",
          "delete department",
          "delete role",
          "exit",
        ],
      },
    ])
    .then((answer) => {
      if (answer.todo === "add employee") {
        addEmployee();
      } else if (answer.todo === "view all employees") {
        allEmployees();
      } else if (answer.todo === "view all employee by department") {
        department();
      } else if (answer.todo === "view all employees by manager") {
        manager();
      } else if (answer.todo === "update role") {
        updateRole();
      } else if (answer.todo === "update employee manager") {
        updateManager();
      } else if (answer.todo === "delete employee") {
        deleteEmployee();
      } else if (answer.todo === "delete department") {
        deleteDepartment();
      } else if (answer.todo === "delete role") {
        deleteRole();
      }
      console.log(answer);
    });
}

// to add an employee
function addEmployee() {
  connection.query(`select * from roles`, (err, roles) => {
    if (err) {
      throw error;
    }
    
      let rol_title = roles.map((role) => {
        return {
          name: role.rol_title,
          value: role.id,
        };
      });

      inquirer.prompt([
        {
          message: "Employee First Name",
          type: "input",
          name: "first_Name",
          validate: (nameInput) => {
            if (nameInput) {
              return true;
            } else {
              console.log("please enter your employee First name");
              return false;
            }
          },
        },
        {
          message: "Employee Last Name",
          type: "input",
          name: "last_Name",
          validate: (nameInput) => {
            if (nameInput) {
              return true;
            } else {
              console.log("please your employee Last Name");
              return false;
            }
          },
        },
        {
          message: "assing a role",
          type: "list",
          name: "role_Id",
          choices: rol_title
        },
      ]).then((answer) => {
        const sql = `insert into employee (first_name , last_name , role_id) 
        values ('${answer.first_Name}' , '${answer.last_Name}' , '${answer.role_Id}' )`
        connection.query(sql , (err, result) => {
          if (err){
            throw error
          }
          console.log("employee added");
          console.table(result)
          todoList()
        })
      })
        
  });
}

// TO GET ALL EMPLOYEES
function allEmployees() {
  const sql = `SELECT * FROM employee
  LEFT JOIN
  roles ON employee.role_id = roles.id
  JOIN department
  ON department.id = roles.dep_id;
`;
  connection.query(sql, (err, rows) => {
    if (err) {
      throw err;
    }
    console.table(rows);
    todoList();
  });
}

// to get EMPLOYEE BY department
function department() {
  connection.query(`SELECT * FROM department`, (err, department) => {
    if (err) {
      throw console.error();
    }

    let departmentsChoices = department.map((departments) => {
      return {
        name: `${departments.dep_name}`,
      };
    });

    inquirer
      .prompt([
        {
          type: "list",
          message: "choose one of the choices",
          name: "dep_name",
          choices: departmentsChoices,
        },
      ])
      .then((answer) => {
        const sql = `select first_name , last_name , rol_title , salary , dep_name
        from employee
        join roles on(employee.role_id = roles.id)
        join department on(department.id = roles.dep_id)
        where dep_name = '${answer.dep_name}';
        `;
        connection.query(sql, (err, result) => {
          if (err) {
            throw err;
          }
          console.table(result);
          todoList();
        });
      });
  });
}

function deleteDepartment() {
  connection.query(`SELECT * FROM department`, (err, department) => {
    if (err) {
      throw err;
    }

    let departmentChoices = department.map((departments) => {
      return {
        name: departments.dep_name,
      };
    });

    inquirer
      .prompt([
        {
          type: "list",
          message: " which department would you like to delete",
          name: "deleteDepartment",
          choices: departmentChoices,
        },
      ])
      .then((answer) => {
        const sql = ` DELETE FROM department where dep_name = ?`;
        const params = `${answer.deleteDepartment}`;

        connection.query(sql, params, (err, result) => {
          if (err) {
            throw err;
          }
          console.log("department deleted");
          console.table(result);
          todoList();
        });
      });
  });
}

function deleteEmployee() {
  connection.query(`select * from employee`, (err, employee) => {
    if (err) {
      throw err;
    }

    let employeeChoices = employee.map((person) => {
      return {
        name: `${person.first_name} ${person.last_name}`,
        value: person.id,
      };
    });

    inquirer
      .prompt([
        {
          type: "list",
          message: "which employee would like to delete",
          name: "deleteEmployee",
          choices: employeeChoices,
        },
      ])
      .then((answer) => {
        const sql = "DELETE FROM employee WHERE id = ?";
        const params = `${answer.deleteEmployee}`;

        connection.query(sql, params, (err, result) => {
          if (err) {
            throw err;
          }
          console.log("Employee deleted");
          console.table(result);
          todoList();
        });
      });
  });
}

function deleteRole() {
  connection.query(`SELECT * from roles`, (err, roles) => {
    if (err) {
      throw console.error();
    }
    let rolesChoices = roles.map((role) => {
      return {
        name: role.rol_title,
      };
    });
    inquirer
      .prompt([
        {
          type: "list",
          message: "which department would you like to delete",
          name: "deleteRole",
          choices: rolesChoices,
        },
      ])
      .then((answer) => {
        const sql = "DELETE FROM roles where rol_title = ?";
        const params = `${answer.deleteRole}`;
        connection.query(sql, params, (err, result) => {
          if (err) {
            throw err;
          }
          console.log("Role delete");
          console.table(result);
          todoList();
        });
      });
  });
}
function updateRole() {
  connection.query(`SELECT * FROM employee`, (err, employees) => {
    if (err) {
      throw new Error(err);
    }
    connection.query("SELECT * FROM roles", (err, roles) => {
      if (err) {
        throw new Error(err);
      }
      let employeeChoices = employees.map((person) => {
        return {
          name: `${person.first_name} ${person.last_name}`,
          value: person.id,
        };
      });
      let rolesChoices = roles.map((role) => {
        return {
          name: role.rol_title,
          value: role.id,
        };
      });

      inquirer
        .prompt([
          {
            message: "employee name you need to up date",
            type: "list",
            name: "emp_id",
            choices: employeeChoices,
          },
          {
            type: "list",
            message: "choose a new role",
            name: "role_id",
            choices: rolesChoices,
          },
        ])
        .then((answer) => {
          const sql = `UPDATE employee
             SET role_id = ${answer.role_id}  WHERE id = ${answer.emp_id}`;
          connection.query(sql, (err, row) => {
            if (err) {
              throw err;
            }
            console.log("role updated");
            console.table(row);
            todoList();
          });
        });
    });
  });
}

todoList();

// inquirer
//     .prompt([
//       {
//         message: "Employee First Name",
//         type: "input",
//         name: "first_Name",
//         validate: (nameInput) => {
//           if (nameInput) {
//             return true;
//           } else {
//             console.log("please enter your employee First name");
//             return false;
//           }
//         },
//       },
//       {
//         message: "Employee Last Name",
//         type: "input",
//         name: "last_Name",
//         validate: (nameInput) => {
//           if (nameInput) {
//             return true;
//           } else {
//             console.log("please your employee Last Name");
//             return false;
//           }
//         },
//       },
//       {
//         message: "Role id number",
//         type: "input",
//         name: "role_Id",
//         validate: (nameInput) => {
//           if (nameInput) {
//             return true;
//           } else {
//             return false;
//           }
//         },
//       },
//       {
//         message: "manager id number",
//         type: "input",
//         name: "manager_Id",
//         validate: (nameInput) => {
//           if (nameInput) {
//             return true;
//           } else {
//             return false;
//           }
//         },
//       },
//     ])
//     .then((answer) => {
//       console.log(answer);
//       const sql = `INSERT INTO roles (first_name , last_name , role_id , manager_id)
//     VALUES (${answer.first_Name} , ${answer.last_Name} , ${answer.role_Id}, ${answer.manager_Id})`;

//       connection.query(sql, (err, result) => {
//         if (err) {
//           throw err;
//         }
//         console.log('employee added')
//         console.table(result);
//         todoList();
//       });
//     });
