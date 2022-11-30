const TableQuery = require("../TableQuery");
const tableName = "punchrecords";
const punchrecords = new TableQuery(tableName, {
  selectOnesql: `SELECT * FROM ${tableName} WHERE punchDateTime = ? AND eAccount = ?;`,
  insertOnesql: `INSERT INTO ${tableName} (punchDateTime, eAccount, GPS, status, remarks) VALUES (?);`,
  deleteOnesql: `DELETE FROM ${tableName} WHERE punchDateTime = ? AND eAccount = ?;`,
  updateOnesql: `UPDATE ${tableName} SET punchDateTime = ?, eAccount = ?, GPS = ?, status = ?, remarks = ? WHERE punchDateTime = ? AND eAccount = ?;`,
  selectAllsql: `SELECT * FROM ${tableName};`,
  insertManysql: `INSERT INTO ${tableName} (punchDateTime, GPS, status, remarks) VALUES ?;`,
  deleteManysql: `DELETE FROM ${tableName} WHERE punchDateTime = ? AND eAccount = ?;`,
  updateManysql: `UPDATE ${tableName} SET punchDateTime = ?, eAccount = ?, GPS = ?, status = ?, remarks = ? WHERE punchDateTime = ? AND eAccount = ?;`,
});

module.exports = punchrecords;