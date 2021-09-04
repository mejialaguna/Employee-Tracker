DROP TABLE IF EXISTS department;
DROP TABLE IF EXISTS employee;
DROP TABLE IF EXISTS roles;



CREATE TABLE department(
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  dep_name VARCHAR(50) NOT NULL
);

create table roles (
id integer AUTO_INCREMENT PRIMARY KEY NOT NULL,
rol_title varchar(30),
salary decimal,
dep_id integer,
FOREIGN KEY (dep_id) REFERENCES department(id) ON DELETE CASCADE
);

CREATE TABLE employee(
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INTEGER NOT NULL,
  manager_id INTEGER ,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE CASCADE
);





-- to SELECT specific data from the tables 
    -- SELECT employee.first_name, employee.last_name ,roles.dep_id , department.dep_name
    -- -> FROM roles
    -- -> JOIN department
    -- -> ON roles.dep_id = department.id
    -- -> JOIN employee
    -- -> ON employee.role_id = roles.id;




-- to SELECT all tables together
    -- SELECT * FROM employee
    -- -> LEFT JOIN
    -- -> roles ON employee.role_id = roles.id
    -- -> JOIN department
    -- -> ON department.id = roles.dep_id;