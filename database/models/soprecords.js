const TableQuery = require("../TableQuery");
const tableName = "soprecords";
const soprecords = new TableQuery(tableName, {
  selectOnesql: `SELECT * FROM ${tableName} WHERE registerDateTime  = ? AND sopClass = ? AND content = ?;`,
  insertOnesql: `INSERT INTO ${tableName} (registerDateTime , sopClass, content, eAccount) VALUES (?);`,
  deleteOnesql: `DELETE FROM ${tableName} WHERE registerDateTime  = ? AND sopClass = ? AND content = ?;`,
  updateOnesql: `UPDATE ${tableName} SET registerDateTime  = ?, sopClass = ?, content = ?, eAccount = ? WHERE registerDateTime  = ? AND sopClass = ? AND content = ?;`,
  selectAllsql: `SELECT * FROM ${tableName};`,
  insertManysql: `INSERT INTO ${tableName} (registerDateTime , sopClass, content, eAccount) VALUES ?;`,
  deleteManysql: `DELETE FROM ${tableName} WHERE registerDateTime  = ? AND sopClass = ? AND content = ?;`,
  updateManysql: `UPDATE ${tableName} SET registerDateTime  = ?, sopClass = ?, content = ?, eAccount = ? WHERE registerDateTime  = ? AND sopClass = ? AND content = ?;`,
});

module.exports = soprecords;