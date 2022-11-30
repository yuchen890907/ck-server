const TableQuery = require("../TableQuery");
const tableName = "customclasses";
const customclasses = new TableQuery(tableName, {
  selectOnesql: `SELECT * FROM ${tableName} WHERE item = ?;`,
  insertOnesql: `INSERT INTO ${tableName} (item, type) VALUES (?);`,
  deleteOnesql: `DELETE FROM ${tableName} WHERE item = ?;`,
  updateOnesql: `UPDATE ${tableName} SET item = ?, type = ? WHERE item = ?;`,
  selectAllsql: `SELECT * FROM ${tableName};`,
  insertManysql: `INSERT INTO ${tableName} (item, type, price) VALUES (?)?;`,
  deleteManysql: `DELETE FROM ${tableName} WHERE item = ?;`,
  updateManysql: `UPDATE ${tableName} SET item = ?, type = ? WHERE item = ?;`,
});

module.exports = customclasses;