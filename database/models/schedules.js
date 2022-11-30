const TableQuery = require("../TableQuery");
const tableName = "schedules";
const schedules = new TableQuery(tableName, {
  selectOnesql: `SELECT * FROM ${tableName} WHERE scheduleNo = ?;`,
  insertOnesql: `INSERT INTO ${tableName} ( workDate, ${'`start`'}, ${'`leave`'}, eAccount, job, remarks) VALUES (?);`,
  deleteOnesql: `DELETE FROM ${tableName} WHERE scheduleNo = ?;`,
  updateOnesql: `UPDATE ${tableName} SET scheduleNo = ?, workDate = ?, ${'`start`'} = ?, ${'`leave`'} = ?, eAccount = ?, job = ?, remarks = ? WHERE scheduleNo = ?;`,
  selectAllsql: `SELECT * FROM ${tableName};`,
  insertManysql: `INSERT INTO ${tableName} (workDate, ${'`start`'}, ${'`leave`'}, eAccount, job, remarks) VALUES ?;`,
  deleteManysql: `DELETE FROM ${tableName} WHERE scheduleNo = ?;`,
  updateManysql: `UPDATE ${tableName} SET scheduleNo = ?, workDate = ?, ${'`start`'} = ?, ${'`leave`'} = ?, eAccount = ?, job = ?, remarks = ? WHERE scheduleNo = ?;`,
});

module.exports = schedules;