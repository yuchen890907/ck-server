const TableQuery = require("../TableQuery");
const tableName = "sopform";
const sopform = new TableQuery(tableName, {
  selectOnesql: `SELECT * FROM ${tableName} WHERE sopClass = ? AND content = ?;`,
  insertOnesql: `INSERT INTO ${tableName} (sopClass, content) VALUES (?);`,
  deleteOnesql: `DELETE FROM ${tableName} WHERE sopClass = ? AND content = ?;`,
  updateOnesql: `UPDATE ${tableName} SET sopClass = ?, content = ? WHERE sopClass = ? AND content = ?;`,
  selectAllsql: `SELECT * FROM ${tableName};`,
  insertManysql: `INSERT INTO ${tableName} (sopClass, content) VALUES ?;`,
  deleteManysql: `DELETE FROM ${tableName} WHERE sopClass = ? AND content = ?;`,
  updateManysql: `UPDATE ${tableName} SET sopClass = ?, content = ? WHERE sopClass = ? AND content = ?;`,
});

module.exports = sopform;