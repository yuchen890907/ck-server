const productcustom = require("../../database/models").productcustom;
const validation = require("../../database/validation");
const { update } = require("../../service/webSocket");
const router = require("express").Router();

router.get("/", async (req, res) => {
	try {
		const [records, field] = await productcustom.findAll();
		const { labels, schemas } = await productcustom.getSchema();
		res.send({
			success: true,
			data: { data: records, labels: labels, schemas: schemas },
		});
	} catch (error) {
		res.status(500).send({ success: false, message: "伺服器發生錯誤" });
	}
});

router.post("/", async (req, res) => {
	const { item, productNo } = req.body;
	const data = {
		item,
		productNo,
	};

	let { error } = validation.productcustomValidation(data);

	if (error) {
		return res.status(403).send({ success: false, message: error.details[0].message });
	}

	try {
		const [records, field] = await productcustom.insertOne(data);
		update(productcustom.tableName);
		res.send({ success: true, data: records });
	} catch (error) {
		res.status(500).send({ success: false, message: "伺服器發生錯誤" });
	}
});

router.put("/", async (req, res) => {
	const { data, item } = req.body;
	let { error } = validation.productcustomValidation(data);

	if (error) {
		return res.status(403).send({ success: false, message: error.details[0].message });
	}

	try {
		const [records, field] = await productcustom.findAll();
		const current_records = records.filter((r) => r.item === item);
		const delete_records = current_records.filter((r) => {
			return data.findIndex((cr) => JSON.stringify(cr) === JSON.stringify(r)) === -1;
		});
		const insert_records = data.filter((r) => {
			return current_records.findIndex((cr) => JSON.stringify(cr) === JSON.stringify(r)) === -1;
		});
		if (delete_records.length > 0) {
			const delete_results = await productcustom.deleteMany(delete_records, ["item", "productNo"]);
		}
		if (insert_records.length > 0) {
			const insert_results = await productcustom.insertMany(insert_records, ["item", "productNo"]);
		}
		update(productcustom.tableName);
		res.send({ success: true, data: current_records });
	} catch (error) {
		// console.log(error);
		res.status(500).send({ success: false, message: "伺服器發生錯誤" });
	}
});

router.delete("/", async (req, res) => {
	const { item, productNo } = req.body;
	const data = {
		item,
		productNo,
	};

	try {
		const [records, field] = await productcustom.deleteOne(data, ["item", "productNo"]);
		update(productcustom.tableName);
		res.send({
			success: true,
			data: records,
		});
	} catch (error) {
		res.status(500).send({ success: false, message: "伺服器發生錯誤" });
	}
});

module.exports = router;
