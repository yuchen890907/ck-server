const TableQuery = require("../TableQuery");
const tableName = "guides";
const guides = new TableQuery(tableName, {
  selectOnesql: `SELECT * FROM ${tableName} WHERE dataID = ?;`,
  insertOnesql: `INSERT INTO ${tableName} (updateDateTime, title, file, eAccount) VALUES (?);`,
  deleteOnesql: `DELETE FROM ${tableName} WHERE dataID = ?;`,
  updateOnesql: `UPDATE ${tableName} SET dataID = ?, updateDateTime = ?, title = ?, file = ?, eAccount = ? WHERE dataID = ?;`,
  selectAllsql: `SELECT * FROM ${tableName};`,
  insertManysql: `INSERT INTO ${tableName} (updateDateTime, title, file, eAccount) VALUES ?;`,
  deleteManysql: `DELETE FROM ${tableName} WHERE dataID = ?;`,
  updateManysql: `UPDATE ${tableName} SET dataID = ?, updateDateTime = ?, title = ?, file = ?, eAccount = ? WHERE dataID = ?;`,
});

module.exports = guides;