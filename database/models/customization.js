const TableQuery = require("../TableQuery");
const tableName = "customization";
const customization = new TableQuery(tableName, {
  selectOnesql: `SELECT * FROM ${tableName} WHERE item = ? AND content = ?;`,
  insertOnesql: `INSERT INTO ${tableName} (item, content, price) VALUES (?);`,
  deleteOnesql: `DELETE FROM ${tableName} WHERE item = ? AND content = ?;`,
  updateOnesql: `UPDATE ${tableName} SET item = ?, content = ?, price = ? WHERE item = ? AND content = ?;`,
  selectAllsql: `SELECT * FROM ${tableName};`,
  insertManysql: `INSERT INTO ${tableName} (item, content, price) VALUES (?)?;`,
  deleteManysql: `DELETE FROM ${tableName} WHERE item = ? AND content = ?;`,
  updateManysql: `UPDATE ${tableName} SET item = ?, content = ?, price = ? WHERE item = ? AND content = ?;`,
});

module.exports = customization;