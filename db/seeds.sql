INSERT INTO department (name)
VALUES
  ('Sales'),
  ('Engineering'),
  ('Finance'),
  ('Legal');

INSERT INTO role (title, salary, department_id)
VALUE
  ('Sales Lead', 100000, 1),
  ('Salesperson', 80000, 1),
  ('Lead Engineer', 150000, 2),
  ('Software Engineer', 120000, 2),
  ('Accountant', 125000, 3),
  ('Legal Team Lead', 250000, 4),
  ('Lawyer', 190000, 4);

INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUE
  ('John', 'Doe', 3, 1),
  ('Mike', 'Chan', 1, 2),
  ('Ashley', 'Rodriguez', NULL, 3),
  ('Kevin', 'Tupik', 3, 4),
  ('Malia', 'Brown', NULL, 5),
  ('Sarah', 'Lourd', NULL, 2),
  ('Tom', 'Allen', 7, 4);
 