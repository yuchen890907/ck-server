// const dbConnection = require("./databaseConnection");

class TableQuery {
	constructor(tableName, options) {
		this.dbConnection = require("./databaseConnection");

		this.tableName = tableName;

		this.selectOnesql = options.selectOnesql;
		this.insertOnesql = options.insertOnesql;
		this.deleteOnesql = options.deleteOnesql;
		this.updateOnesql = options.updateOnesql;

		this.selectAllsql = options.selectAllsql;
		this.insertManysql = options.insertManysql;
		this.deleteManysql = options.deleteManysql;
		this.updateManysql = options.updateManysql;
	} //end constructor

	// #region CRUD methods

	async findOne(value) {
		try {
			return await this.dbConnection.query(this.selectOnesql, [value]);
		} catch (error) {
			console.error(error);
			return null;
		}
	} //end findOne()

	async findAll() {
		try {
			return await this.dbConnection.query(this.selectAllsql);
		} catch (error) {
			console.error(error);
			return null;
		}
	} //end findAll()

	async insertOne(item) {
		try {
			const record = Object.values(item);
			return await this.dbConnection.query(this.insertOnesql, [record]);
		} catch (error) {
			console.error(error);
			return null;
		}
	} //end insertOne()

	async insertMany(data) {
		try {
			const dataSet = data.map((item) => Object.values(item));
			return await this.dbConnection.query(this.insertManysql, [dataSet]);
		} catch (error) {
			console.error(error);
			return null;
		}
	} //end insertMany()

	async updateOne(item, keys) {
		try {
			const record = [...Object.values(item), ...keys.map((key) => item[key])];
			return await this.dbConnection.query(this.updateOnesql, record); //.slice(keys.length)
		} catch (error) {
			console.error(error);
			return null;
		}
	} //end updateOne()

	async updateMany(data, keys) {
		try {
			const dataSet = data.map(
				(item) => [...Object.values(item), ...keys.map((key) => item[key])] //.slice(keys.length)
			);
			return await this.dbConnection.query(this.updateManysql, dataSet);
		} catch (error) {
			console.error(error);
			return null;
		}
	} //end updateMany()

	async deleteOne(data, keys) {
		try {
			return await this.dbConnection.query(
				this.deleteOnesql,
				keys.map((key) => data[key])
			);
		} catch (error) {
			console.error(error);
			return null;
		}
	} //end deleteOne()

	async deleteMany(data, keys) {
		const dataSet = data.map((item) => keys.map((key) => item[key]));
		try {
			return await this.dbConnection.query(this.deleteManysql, [dataSet]);
		} catch (error) {
			console.error(error);
			return null;
		}
	} //end deleteMany()

	// #endregion

	async getSchema() {
		try {
			const sql = `SELECT a.COLUMN_NAME, a.COLUMN_COMMENT
                   FROM information_schema.COLUMNS a
                   WHERE a.TABLE_NAME = '${this.tableName}';`;

			const [records, fields] = await this.dbConnection.query(sql);
			const schema = { labels: [], schemas: [] };
			records.forEach((record) => {
				schema.labels.push(record.COLUMN_COMMENT);
				schema.schemas.push(record.COLUMN_NAME);
			});
			return schema;
		} catch (error) {
			console.log(error);
			return null;
		}
	}
} //end class TableQuery

module.exports = TableQuery;
