var inquirer = require("inquirer");
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
  inquirer
    .prompt([
      {
        message: "Employee First Name",
        type: "input",
        name: "firstName",
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
        name: "LastName",
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
        message: "Role id number",
        type: "input",
        name: "roleId",
        validate: (nameInput) => {
          if (nameInput) {
            return true;
          } else {
            return false;
          }
        },
      },
      {
        message: "manager id number",
        type: "input",
        name: "managerId",
        validate: (nameInput) => {
          if (nameInput) {
            return true;
          } else {
            return false;
          }
        },
      },
    ])
    .then((answer) => {
      console.log(answer);
      const sql = `INSERT INTO roles (first_name , last_name , role_id , manager_id)
    VALUES (? , ?, ? ,?)`;
      const params = [
        answer.firstName,
        answer.lastName,
        answer.roleId,
        answer.managerId,
      ];
      connection.query(sql, params, (err, result) => {
        if (err) {
          throw err;
        }
        console.table(result);
        todoList();
      });
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
  const sql = `SELECT employee.first_name, employee.last_name ,roles.dep_id , department.dep_name
  FROM roles
  JOIN department
  ON roles.dep_id = department.id
  JOIN employee
  ON employee.role_id = roles.id;`;
  connection.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    console.table(result);
  });
  todoList();
}

function deleteDepartment() {
  connection.query(`SELECT * FROM department`, (err, department) => {
    if (err) {
      throw err;
    }

    let departmentChoices = department.map((departments) => {
      return {
        name: departments.dep_name
      }
    })

    inquirer
      .prompt([
        {
          type: "list",
          message: " which department would you like to delete",
          name: "deleteDepartment",
          choices: departmentChoices
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
          todoList()
        });
      });
  });
}

function deleteEmployee() {

connection.query(`select * from employee` , (err , employee) => {
  if (err){
    throw err
  }

  let employeeChoices = employee.map((person) => {
    return {
      name: `${person.first_name} ${person.last_name}`,
      value: person.id
    }
  })
  
  inquirer
  .prompt([
    {
      type: "list",
      message: "which employee would like to delete",
      name: "deleteEmployee",
      choices : employeeChoices,
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
      todoList()
    });
  });
})
}

function deleteRole() {
  connection.query(`SELECT * from roles`, (err, roles) => {
    if (err) {
      throw console.error();
    }
    let rolesChoices = roles.map((role) => {
      return {
        name: role.rol_title
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
            console.log('role updated')
            console.table(row);
            todoList();
          });
        });
    });
  });
}

todoList();
