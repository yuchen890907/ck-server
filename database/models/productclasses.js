const TableQuery = require("../TableQuery");
const tableName = "productclasses";
const productclasses = new TableQuery(tableName, {
  selectOnesql: `SELECT * FROM ${tableName} WHERE classNo = ?;`,
  insertOnesql: `INSERT INTO ${tableName} (classNo, className) VALUES (?);`,
  deleteOnesql: `DELETE FROM ${tableName} WHERE classNo = ?;`,
  updateOnesql: `UPDATE ${tableName} SET classNo = ?, className = ? WHERE classNo = ?;`,
  selectAllsql: `SELECT * FROM ${tableName};`,
  insertManysql: `INSERT INTO ${tableName} (classNo, className) VALUES ?;`,
  deleteManysql: `DELETE FROM ${tableName} WHERE classNo = ?;`,
  updateManysql: `UPDATE ${tableName} SET classNo = ?, className = ? WHERE classNo = ?;`,
});

module.exports = productclasses;