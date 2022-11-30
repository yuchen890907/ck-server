const TableQuery = require("../TableQuery");
const tableName = "saledetails";
const saledetails = new TableQuery(tableName, {
  selectOnesql: `SELECT * FROM ${tableName} WHERE saleInvoice = ? AND itemNo = ? AND productNo = ?;`,
  insertOnesql: `INSERT INTO ${tableName} (saleInvoice, itemNo, productNo, quantity, unitPrice, remarks) VALUES (?);`,
  deleteOnesql: `DELETE FROM ${tableName} WHERE saleInvoice = ? AND itemNo = ? AND productNo = ?;`,
  updateOnesql: `UPDATE ${tableName} SET saleInvoice = ?, itemNo = ?, productNo = ?, quantity = ?, unitPrice = ?, remarks = ? WHERE saleInvoice = ? AND itemNo = ? AND productNo = ?;`,
  selectAllsql: `SELECT * FROM ${tableName};`,
  insertManysql: `INSERT INTO ${tableName} (saleInvoice, itemNo, productNo, quantity, unitPrice, remarks) VALUES ? ;`,
  deleteManysql: `DELETE FROM ${tableName} WHERE saleInvoice = ? AND itemNo = ? AND productNo = ?;`,
  updateManysql: `UPDATE ${tableName} SET saleInvoice = ?, itemNo = ?, productNo = ?, quantity = ?, unitPrice = ?, remarks = ? WHERE saleInvoice = ? AND itemNo = ? AND productNo = ?;`,
});

module.exports = saledetails;