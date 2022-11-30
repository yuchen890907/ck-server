const TableQuery = require("../TableQuery");
const tableName = "positions";
const positions = new TableQuery(tableName, {
	selectOnesql: `SELECT * FROM ${tableName} WHERE position = ?;`,
	insertOnesql: `INSERT INTO ${tableName} (position, level, permissions) VALUES (?);`,
	deleteOnesql: `DELETE FROM ${tableName} WHERE position = ?;`,
	updateOnesql: `UPDATE ${tableName} SET position = ?, level = ?, permissions = ? WHERE position = ?;`,
	selectAllsql: `SELECT * FROM ${tableName} ORDER BY level;`,
	insertManysql: `INSERT INTO ${tableName} (position, level, permissions) VALUES ?;`,
	deleteManysql: `DELETE FROM ${tableName} WHERE position = ?;`,
	updateManysql: `UPDATE ${tableName} SET position = ?, level = ?, permissions = ? WHERE position = ?;`,
});

module.exports = positions;
