const TableQuery = require("../TableQuery");
const tableName = "genericgoods";
const genericgoods = new TableQuery(tableName, {
  selectOnesql: `SELECT * FROM ${tableName} WHERE genericgoodNo = ?;`,
  insertOnesql: `INSERT INTO ${tableName} (genericgoodNo, genericgoodName, unit, inventory, sale_Inventory) VALUES (?);`,
  deleteOnesql: `DELETE FROM ${tableName} WHERE genericgoodNo = ?;`,
  updateOnesql: `UPDATE ${tableName} SET genericgoodNo = ?, genericgoodName = ?, unit = ?, inventory = ?, sale_Inventory = ? WHERE genericgoodNo = ?;`,
  selectAllsql: `SELECT * FROM ${tableName};`,
  insertManysql: `INSERT INTO ${tableName} (genericgoodNo, genericgoodName, unit, inventory, sale_Inventory) VALUES ?;`,
  deleteManysql: `DELETE FROM ${tableName} WHERE genericgoodNo = ?;`,
  updateManysql: `UPDATE ${tableName} SET genericgoodNo = ?, genericgoodName = ?, unit = ?, inventory = ?, sale_Inventory = ? WHERE genericgoodNo = ?;`,
});

module.exports = genericgoods;