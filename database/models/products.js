const TableQuery = require("../TableQuery");
const tableName = "products";
const products = new TableQuery(tableName, {
  selectOnesql: `SELECT * FROM ${tableName} WHERE productNo = ?;`,
  insertOnesql: `INSERT INTO ${tableName} (productNo, productName, unitPrice, img, classNo) VALUES (?);`,
  deleteOnesql: `DELETE FROM ${tableName} WHERE productNo = ?;`,
  updateOnesql: `UPDATE ${tableName} SET productNo = ?, productName = ?, unitPrice = ?, img = ?, classNo = ? WHERE productNo = ?;`,
  selectAllsql: `SELECT * FROM ${tableName};`,
  insertManysql: `INSERT INTO ${tableName} (productNo, productName, unitPrice, img, classNo) VALUES ?;`,
  deleteManysql: `DELETE FROM ${tableName} WHERE classNo = ?;`,
  updateManysql: `UPDATE ${tableName} SET productNo = ?, productName = ?, unitPrice = ?, img = ?, classNo = ? WHERE productNo = ?;`,
});

module.exports = products;