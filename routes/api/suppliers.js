const suppliers = require("../../database/models").suppliers;
const permissionMiddleware = require("../../config/middleware");
const validation = require("../../database/validation");
const { update } = require("../../service/webSocket");
const router = require("express").Router();
router.use(permissionMiddleware);
router.get("/", async (req, res) => {
	try {
		const [records, field] = await suppliers.findAll();
		const { labels, schemas } = await suppliers.getSchema();
		res.send({
			success: true,
			data: { data: records, labels: labels, schemas: schemas },
		});
	} catch (error) {
		res.status(500).send({ success: false, message: "伺服器發生錯誤" });
	}
});

router.post("/", async (req, res) => {
	const { supplierNo, supplierName, headName, phone, postalCode, address } = req.body;
	const data = {
		supplierNo,
		supplierName,
		headName,
		phone,
		postalCode,
		address,
	};

	let { error } = validation.suppliersValidation(data);

	if (error) {
		return res.status(403).send({ success: false, message: error.details[0].message });
	}

	try {
		const [records, field] = await suppliers.insertOne(data);
		update(suppliers.tableName);
		res.send({ success: true, data: records });
	} catch (error) {
		res.status(500).send({ success: false, message: "伺服器發生錯誤" });
	}
});

router.put("/", async (req, res) => {
	const { supplierNo, supplierName, headName, phone, postalCode, address } = req.body;
	const data = {
		supplierNo,
		supplierName,
		headName,
		phone,
		postalCode,
		address,
	};

	let { error } = validation.suppliersValidation(data);

	if (error) {
		return res.status(403).send({ success: false, message: error.details[0].message });
	}

	try {
		const [records, field] = await suppliers.updateOne(data, ["supplierNo"]);
		update(suppliers.tableName);
		res.send({ success: true, data: records });
	} catch (error) {
		res.status(500).send({ success: false, message: "伺服器發生錯誤" });
	}
});

router.delete("/", async (req, res) => {
	const { supplierNo, supplierName, headName, phone, postalCode, address } = req.body;
	const data = {
		supplierNo,
		supplierName,
		headName,
		phone,
		postalCode,
		address,
	};

	try {
		const [records, field] = await suppliers.deleteOne(data, ["supplierNo"]);
		update(suppliers.tableName);
		res.send({
			success: true,
			data: records,
		});
	} catch (error) {
		res.status(500).send({ success: false, message: "伺服器發生錯誤" });
	}
});

module.exports = router;
