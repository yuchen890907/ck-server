const TableQuery = require("../TableQuery");
const tableName = "employees";
const employees = new TableQuery(tableName, {
  selectOnesql: `SELECT * FROM ${tableName} WHERE account = ?;`,
  insertOnesql: `INSERT INTO ${tableName} (account, password, name, sex, phone, email, position, salary, enrollmentDate) VALUES (?);`,
  deleteOnesql: `DELETE FROM ${tableName} WHERE account = ?;`,
  updateOnesql: `UPDATE ${tableName} SET account = ?, password = ?, name = ?, sex = ?, phone = ?, email = ?, position = ?, salary = ?, enrollmentDate = ?, resignationDate = ? WHERE account = ?;`, 
  selectAllsql: `SELECT * FROM ${tableName};`,
  insertManysql: `INSERT INTO ${tableName} (account, password, name, sex, phone, email, position, salary, enrollmentDate) VALUES ?;`,
  deleteManysql: `DELETE FROM ${tableName} WHERE account = ?;`,
  updateManysql: `UPDATE ${tableName} SET account = ?, password = ?, name = ?, sex = ?, phone = ?, email = ?, position = ?, salary = ?, enrollmentDate = ? , resignationDate = ? WHERE account = ?;`,
});

module.exports = employees;