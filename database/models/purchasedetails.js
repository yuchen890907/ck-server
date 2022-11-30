const TableQuery = require("../TableQuery");
const tableName = "purchasedetails";
const purchasedetails = new TableQuery(tableName, {
  selectOnesql: `SELECT * FROM ${tableName} WHERE purchaseInvoice = ? AND genericgoodNo = ?;`,
  insertOnesql: `INSERT INTO ${tableName} (purchaseInvoice, genericgoodNo, quantity, unitPrice) VALUES (?);`,
  deleteOnesql: `DELETE FROM ${tableName} WHERE purchaseInvoice = ? AND genericgoodNo = ?;`,
  updateOnesql: `UPDATE ${tableName} SET purchaseInvoice = ?, genericgoodNo = ?, quantity = ?, unitPrice = ? WHERE purchaseInvoice = ? AND genericgoodNo = ?;`,
  selectAllsql: `SELECT * FROM ${tableName};`,
  insertManysql: `INSERT INTO ${tableName} (purchaseInvoice, genericgoodNo, quantity, unitPrice) VALUES ?;`,
  deleteManysql: `DELETE FROM ${tableName} WHERE purchaseInvoice = ? AND genericgoodNo = ?;`,
  updateManysql: `UPDATE ${tableName} SET purchaseInvoice = ?, genericgoodNo = ?, quantity = ?, unitPrice = ? WHERE purchaseInvoice = ? AND genericgoodNo = ?;`,
});

module.exports = purchasedetails;