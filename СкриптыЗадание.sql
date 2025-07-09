SELECT * FROM Employees;

SELECT * FROM Employees WHERE Salary > 10000;

DELETE FROM Employees
WHERE DATEDIFF(YEAR, BirthDate, GETDATE()) > 70;

UPDATE Employees
SET Salary = 15000
WHERE Salary < 15000;
