var inquirer = require("inquirer");
const connection = require("./db/connection");


// main function
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
          "add an department",
          "view all departments",
          "view all employee by department",
          "view all roles",
          "update role",
          "delete employee",
          "delete department",
          "delete role",
        ],
      },
    ])
    .then((answer) => {
      if (answer.todo === "add employee") {
        addEmployee();
      } else if (answer.todo === "view all employees") {
        allEmployees();
      } else if (answer.todo === "view all employees by manager") {
        EmByManager();
      } else if (answer.todo === "add an department") {
        addDepartment();
      } else if (answer.todo === "view all departments") {
        showDepartments();
      } else if (answer.todo === "view all employee by department") {
        department();
      } else if (answer.todo === "view all employees by manager") {
        manager();
      } else if (answer.todo === "view all roles") {
        allRoles();
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
    });
}
// to add an employee
function addEmployee() {
  connection.query(`select * from roles`, (err, roles) => {
    if (err) {
      throw new Error(err);
    }

    let rol_title = roles.map((role) => {
      return {
        name: role.rol_title,
        value: role.dep_id,
      };
    });

    inquirer
      .prompt([
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
          choices: rol_title,
        },
        {
          message: "manager id number",
          name: "manager_id",
          type: "input",
        },
      ])
      .then((answer) => {
            
        connection.query(sql, params, (err, result) => {
          if (err) {
            throw new Error(err);
          }
          console.table(result);
          console.log("successfully added");
          todoList();
        });
      });
  });
}
// TO GET ALL EMPLOYEES
function allEmployees() {
  const sql = ` SELECT employee.id, employee.first_name, employee.last_name, employee.role_id AS role, CONCAT(manager.first_name, ' ', manager.last_name) as manager, department.dep_name AS department FROM employee
  LEFT JOIN roles on employee.role_id = roles.id
  LEFT JOIN department on department.id = roles.dep_id
  LEFT JOIN employee manager on employee.manager_id = manager.id ;
`;
  connection.query(sql, (err, rows) => {
    if (err) {
      throw err;
    }
    console.table(rows);
    todoList();
  });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        message: "Name of department",
        name: "add_department",
        type: "input",
      },
      {
        message: "name of the new role",
        type: "input",
        name: "new_role",
      },
      {
        message: "new role salary",
        type: "input",
        name: "newSalary",
      },
      {
        message: "department id number",
        type: "input",
        name: "dep_id",
      },
    ])
    .then((answer) => {
      const sql = `insert into department (dep_name)
      values (?)`;
      const params = ` ${answer.add_department}`;
      connection.query(sql, params, (err, result) => {
        if (err) {
          throw new Error(err);
        }

        const sql = `insert into roles ( rol_title , salary , dep_id) 
          values( ? ,? ,?)`;
        const params = [answer.new_role, answer.newSalary, answer.dep_id];

        connection.query(sql, params, (err, result) => {
          if (err) {
            throw new Error(err);
          }
          console.table(result);
          console.log("department added to the roaster");
          todoList();
        });
      });
    });
}
// SHOW ALL department Function
function showDepartments() {
  const sql = ` select * from department`;
  connection.query(sql, (err, result) => {
    if (err) {
      throw new Error(err);
    }
    console.table(result);
    todoList();
  });
}
// to get EMPLOYEE BY department using join and where
function department() {
  connection.query(`SELECT * FROM department`, (err, department) => {
    if (err) {
      throw new Error(err);
    }

    let departmentsChoices = department.map((departments) => {
      return {
        name: departments.dep_name,
      };
    });

    inquirer
      .prompt([
        {
          type: "list",
          message: "choose one of department",
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
            throw new Error(err);
          }
          console.table(result);
          console.log("successfully loaded");
          todoList();
        });
      });
  });
}

function deleteDepartment() {
  connection.query(`SELECT * FROM department`, (err, department) => {
    if (err) {
      throw new Error(err);
    }

    let departmentChoices = department.map((departments) => {
      return {
        name: departments.dep_name,
        value: departments.id,
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
        const sql = ` DELETE FROM department WHERE id = ?`;
        const params = `${answer.deleteDepartment}`;

        connection.query(sql, params, (err, result) => {
          if (err) {
            throw new Error(err);
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
      throw new Error(err);
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
            throw new Error(err);
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
            throw new Error(err);
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
              throw new Error(err);
            }
            console.table(row);
            todoList();
          });
        });
    });
  });
}
// gets all roles 
function allRoles() {
  const sql = `select roles.rol_title as JOB_Title , 
  employee.role_id , department.dep_name as department , salary
 from roles
 join department
 on roles.dep_id = department.id
 join employee
 on employee.role_id = roles.id`;

  connection.query(sql, (err, result) => {
    if (err) {
      throw new Error(err);
    }
    console.table(result);
    todoList();
  });
}
// employee by manager
function EmByManager() {
  let sql = `SELECT * FROM employee WHERE manager_id IS NULL`;

  connection.query(sql, function (err, manager) {
    if (err) throw new Error(err);
    const managers = manager.map(function (element) {
      return {
        name: `${element.first_name} ${element.last_name}`,
        value: element.id,
      };
    });
    inquirer
      .prompt([
        {
          type: "list",
          name: "managerName",
          message: "Please select manager to view employees",
          choices: managers,
        },
      ])
      .then((answer) => {
        let sql = `SELECT employee.id, employee.first_name, employee.last_name, employee.role_id AS role, CONCAT(manager.first_name, ' ', manager.last_name) as manager, department.dep_name AS department FROM employee
        LEFT JOIN roles on employee.role_id = roles.id
        LEFT JOIN department on department.id = roles.dep_id
        LEFT JOIN employee manager on employee.manager_id = manager.id
        WHERE employee.manager_id = ${answer.managerName}`;
        connection.query(sql, (err, result) => {
          if (err) {
            throw new Error(err);
          }
          console.table(result);
          todoList();
        });
      });
  });
}

todoList();
