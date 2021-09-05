INSERT INTO department(dep_name)
VALUES
("Sales"),
("Hopitality"),
("Engineering"),
("Finance"),
("Legal");

INSERT INTO roles(rol_title , salary , dep_id)
VALUES
("Sales Lead" , 100000 , 1 ),
("Costumer Service" , 50000 , 2),
("Engineer" , 120000 , 3),
("Finance" , 150000 , 4),
("Lawyer" , 200000 , 5);

INSERT INTO employee(first_name , last_name , role_id , manager_id)
VALUES
("Zack" , "Apuntas" , 2 , 1),
("Char", "Dant", 1, null),
("Jonathan", "Uong", 3, null),
("Jose", "Mejia", 4, null),
("Evelyn", "Sarmiento", 1, 3),
("Melissa", "Diaz", 3, 5),
("Jonh", "Uong", 2, 2);
