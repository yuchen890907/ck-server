const TableQuery = require("../TableQuery");
const tableName = "productcustom";
const productcustom = new TableQuery(tableName, {
	selectOnesql: `SELECT * FROM ${tableName} WHERE item = ? AND productNo  = ?;`,
	insertOnesql: `INSERT INTO ${tableName} (item, productNo) VALUES (?);`,
	deleteOnesql: `DELETE FROM ${tableName} WHERE item = ? AND productNo = ?;`,
	updateOnesql: `UPDATE ${tableName} SET item = ?, productNo = ? WHERE item = ? AND productNo = ?;`,
	selectAllsql: `SELECT * FROM ${tableName};`,
	insertManysql: `INSERT INTO ${tableName} (item, productNo) VALUES ?;`,
	deleteManysql: `DELETE FROM ${tableName} WHERE (item, productNo) IN (?);`,
	updateManysql: `UPDATE ${tableName} SET item = ?, productNo = ? WHERE item = ? AND productNo = ?;`,
});

module.exports = productcustom;
