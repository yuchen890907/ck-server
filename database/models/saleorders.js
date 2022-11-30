const TableQuery = require("../TableQuery");
const tableName = "saleorders";
const saleorders = new TableQuery(tableName, {
  selectOnesql: `SELECT * FROM ${tableName} WHERE saleInvoice = ?;`,
  insertOnesql: `INSERT INTO ${tableName} (saleInvoice, saleDateTime, orderTime, completeTime, forHere, count, total, payment, status) VALUES (?);`,
  deleteOnesql: `DELETE FROM ${tableName} WHERE saleInvoice = ?;`,
  updateOnesql: `UPDATE ${tableName} SET saleInvoice = ?, saleDateTime = ?, orderTime = ?, completeTime = ?, forHere = ?, count = ?, total = ?, payment = ?, status = ? WHERE saleInvoice = ?;`,
  selectAllsql: `SELECT * FROM ${tableName};`,
  insertManysql: `INSERT INTO ${tableName} (saleInvoice, saleDateTime, orderTime, completeTime, forHere, count, total, payment, status) VALUES ? ;`,
  deleteManysql: `DELETE FROM ${tableName} WHERE saleInvoice = ?;`,
  updateManysql: `UPDATE ${tableName} SET saleInvoice = ?, saleDateTime = ?, orderTime = ?, completeTime = ?, forHere = ?, count = ?, total = ?, payment = ?, status = ? WHERE saleInvoice = ?;`,
});

module.exports = saleorders;