const TableQuery = require("../TableQuery");
const tableName = "boms";
const boms = new TableQuery(tableName, {
  selectOnesql: `SELECT * FROM ${tableName} WHERE productNo = ? AND genericgoodNo = ?;`,
  insertOnesql: `INSERT INTO ${tableName} (productNo, genericgoodNo, quantity, unit) VALUES (?);`,
  deleteOnesql: `DELETE FROM ${tableName} WHERE productNo = ? AND genericgoodNo = ?;`,
  updateOnesql: `UPDATE ${tableName} SET productNo = ?, genericgoodNo = ?, quantity = ?, unit = ? WHERE productNo = ? AND genericgoodNo = ?;`,
  selectAllsql: `SELECT * FROM ${tableName};`,
  insertManysql: `INSERT INTO ${tableName} (productNo, genericgoodNo, quantity, unit) VALUES (?)?;`,
  deleteManysql: `DELETE FROM ${tableName} WHERE productNo = ? AND genericgoodNo = ?;`,
  updateManysql: `UPDATE ${tableName} SET productNo = ?, genericgoodNo = ?, quantity = ?, unit = ? WHERE productNo = ? AND genericgoodNo = ?;`,
});

module.exports = boms;