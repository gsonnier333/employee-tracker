USE manage_db;

DELETE FROM departments;
DELETE FROM roles;
DELETE FROM employees;

INSERT INTO departments (name) VALUE ("Customer Service");
INSERT INTO departments (name) VALUE ("Marketing");

INSERT INTO roles (title, salary, department_id) VALUES ("Tech Support", 35000, 1);
INSERT INTO roles (title, salary, department_id) VALUES ("Trends Analyst", 120000, 2);

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("Cherry", "Dude", 1, 2);
INSERT INTO employees (first_name, last_name, role_id) VALUES ("Robert", "Peoples", 2);