const TableQuery = require("../TableQuery");
const tableName = "seats";
const seats = new TableQuery(tableName, {
  selectOnesql: `SELECT * FROM ${tableName} WHERE tableNo = ?;`,
  insertOnesql: `INSERT INTO ${tableName} (tableNo, capacity) VALUES (?);`,
  deleteOnesql: `DELETE FROM ${tableName} WHERE tableNo = ?;`,
  updateOnesql: `UPDATE ${tableName} SET tableNo = ?, capacity = ? WHERE tableNo = ?;`,
  selectAllsql: `SELECT * FROM ${tableName};`,
  insertManysql: `INSERT INTO ${tableName} (tableNo, capacity) VALUES ?;`,
  deleteManysql: `DELETE FROM ${tableName} WHERE tableNo = ?;`,
  updateManysql: `UPDATE ${tableName} SET tableNo = ?, capacity = ? WHERE tableNo = ?;`,
});

module.exports = seats;