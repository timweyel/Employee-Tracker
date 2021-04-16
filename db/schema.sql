DROP TABLE IF EXISTS department;
DROP TABLE IF EXISTS role;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) 
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30),
  salary DECIMAL(6,0),
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES department(id)
);