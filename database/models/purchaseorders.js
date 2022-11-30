const TableQuery = require("../TableQuery");
const tableName = "purchaseorders";
const purchaseorders = new TableQuery(tableName, {
  selectOnesql: `SELECT * FROM ${tableName} WHERE purchaseInvoice = ?;`,
  insertOnesql: `INSERT INTO ${tableName} (purchaseInvoice, purchaseDateTime, total, eAccount, sPhone) VALUES (?);`,
  deleteOnesql: `DELETE FROM ${tableName} WHERE purchaseInvoice = ?;`,
  updateOnesql: `UPDATE ${tableName} SET purchaseInvoice = ?, purchaseDateTime = ?, total = ?, eAccount = ?, sPhone = ? WHERE purchaseInvoice = ?;`,
  selectAllsql: `SELECT * FROM ${tableName};`,
  insertManysql: `INSERT INTO ${tableName} (purchaseInvoice, purchaseDateTime, total, eAccount, sPhone) VALUES ?;`,
  deleteManysql: `DELETE FROM ${tableName} WHERE purchaseInvoice = ?;`,
  updateManysql: `UPDATE ${tableName} SET purchaseInvoice = ?, purchaseDateTime = ?, total = ?, eAccount = ?, sPhone = ? WHERE purchaseInvoice = ?;`,
});

module.exports = purchaseorders;