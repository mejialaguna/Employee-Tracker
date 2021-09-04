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
          "add an employee",
          "view all employees",
          "view all employees by manager",
          "view all employee by department",
          "update employee role",
          "update employee manager",
          "delete employee",
          "delete department",
          "delete role",
          "exit",
        ],
      },
    ])
    .then((answer) => {
      console.log(answer);
      if (answer.todo === "add an employee") {
        addEmployee();
      } else if( answer.todo === "view all employees"){
        allEmployees()
      } else if (answer.todo === "view all employee by department"){
        department()
      } else if( answer.todo === "view all employees by manager"){
        manager()
      } else if ( answer.todo === "update employee by role"){
        updateRole()
      } else if (answer.todo === "update employee manager"){
        updateManager()
      } else if (answer.todo === "delete employee"){
        deleteEmployee()
      } else if (answer.todo === "delete department"){
        deleteRole()
      } else{}
      
        });
      }
      // else{todo()}


// TO GET ALL EMPLOYEES 
function allEmployees(){
const sql = `SELECT * FROM employee
  LEFT JOIN
  roles ON employee.role_id = roles.id
  JOIN department
  ON department.id = roles.dep_id;
`
connection.query(sql , (err , rows) => {
  if (err){
    throw err;
  }
  console.table(rows);
  
})
todoList()
}

// to get EMPLOYEE BY department
function department(){
  const sql = `SELECT employee.first_name, employee.last_name ,roles.dep_id , department.dep_name
  FROM roles
  JOIN department
  ON roles.dep_id = department.id
  JOIN employee
  ON employee.role_id = roles.id;`
  connection.query( sql , (err, result) => {
    if (err) {
      throw err;
    }
    console.table(result);
  })
  todo()
}


function addEmployee() {
  inquirer
    .prompt([
      {
        message: "First Name",
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
        message: "Last Name",
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
        message: " Role id number",
        type: "input",
        name: "roleId",
        validate: (nameInput) => {
          if (nameInput) {
            return true;
          } else {
            return null;
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
            return null;
          }
        },
      },
    ])
    .then((answer) => {
      console.log(answer);
      const sql = `INSERT INTO roles (first_name , last_name , role_id , manager_id)
    VALUES (? , ?, ? ,?)`;
    const params = [answer.firstName ,answer.lastName, answer.roleId ,answer.managerId ];
      connection.query(sql, params , (err, result) => {
        if(err){
          throw err;
        } 
        console.table(result);
      });
    });
    
}



// function updateRole(){

// connection.query( `SELECT * FROM employees`, (err , employees) =>{
//   if (err){
//     throw new Error(err);
//   }
//   connection.query( 'SELECT * FROM roles' , (err , roles) =>{
//     if(err){
//       throw new Error(err);
//     }
//     let employeeChoices = employees.map(person =>{
//       return {
//         name: `${person.first_name} ${person.last_name}`,
//         value: person.id
//       }
//     })
//   })
// })

// }

todoList();

// {
//   type: "list",
//   message: " whats is the role of your employee",
//   name: "employeeRole",
//   choices: ["Engineer" , "Lawyer" , "Seller" , "costumer service", "Finance" ,"Janitor"]
// },
// {
//   type: 'list',
//   name: "employeeDepartment",
//   choices: ["Legal" , "Engineering" , "Costumer Rep" , "financing" , "Custodian" , "Sales"]
// },
// {
//  type: "input",
//  message: "employee salary"
// },
// {
//   type: 'input',
//   name: "managerName",
//   message: "employee manager name",
// }
