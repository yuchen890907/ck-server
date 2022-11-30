const TableQuery = require("../TableQuery");
const tableName = "suppliers";
const suppliers = new TableQuery(tableName, {
  selectOnesql: `SELECT * FROM ${tableName} WHERE supplierNo = ?;`,
  insertOnesql: `INSERT INTO ${tableName} (supplierNo, supplierName, headName, phone, postalCode, address) VALUES (?);`,
  deleteOnesql: `DELETE FROM ${tableName} WHERE supplierNo = ?;`,
  updateOnesql: `UPDATE ${tableName} SET supplierNo = ?, supplierName = ?, headName = ?, phone = ?, postalCode = ?, address = ? WHERE supplierNo = ?;`,
  selectAllsql: `SELECT * FROM ${tableName};`,
  insertManysql: `INSERT INTO ${tableName} (supplierNo, supplierName, headName, phone, postalCode, address) VALUES ?;`,
  deleteManysql: `DELETE FROM ${tableName} WHERE supplierNo = ?;`,
  updateManysql: `UPDATE ${tableName} SET supplierNo = ?, supplierName = ?, headName = ?, phone = ?, postalCode = ?, address = ? WHERE supplierNo = ?;`,
});

module.exports = suppliers;