const positions = require("../../database/models").positions;
const validation = require("../../database/validation");
const { update } = require("../../service/webSocket");
const router = require("express").Router();
const { permissions } = require("../../config/permissions");
router.get("/", async (req, res) => {
	try {
		const [records, field] = await positions.findAll();
		const { labels, schemas } = await positions.getSchema();
		records.forEach((record) => (record.permissions = JSON.parse(record.permissions || "{}")));
		res.send({
			success: true,
			data: { data: records, labels, schemas, permissions },
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({ success: false, message: "伺服器發生錯誤" });
	}
});

router.post("/", async (req, res) => {
	const { position, level, permissions } = req.body;
	const data = { position, level, permissions: JSON.stringify(permissions) };

	let { error } = validation.positionsValidation(data);
	if (error) return res.status(403).send({ success: false, message: error.details[0].message });

	try {
		//限制新增比自身權限高的權限等級
		const [positions_records] = await positions.findAll();
		if (level <= positions_records.find((record) => record.position === req.user.position).level)
			return res.status(403).send({ success: false, message: "權限不足" });

		const [records, field] = await positions.insertOne(data);
		update(positions.tableName);
		res.send({ success: true, data: records });
	} catch (error) {
		console.log(error);
		res.status(500).send({ success: false, message: "伺服器發生錯誤" });
	}
});

router.put("/", async (req, res) => {
	const { position, level, permissions } = req.body;
	const data = { position, level, permissions: JSON.stringify(permissions) };

	let { error } = validation.positionsValidation(data);
	if (error) return res.status(403).send({ success: false, message: error.details[0].message });

	try {
		//限制更改比自身權限高的權限等級

		const [positions_records] = await positions.findAll();
		const myLevel = positions_records.find((record) => record.position === req.user.position).level;
		const originLevel = positions_records.find((record) => record.position === position).level;
		if (level <= myLevel || originLevel <= myLevel) return res.status(403).send({ success: false, message: "權限不足" });

		const [records, field] = await positions.updateOne(data, ["position"]);
		update(positions.tableName);
		res.send({ success: true, data: records });
	} catch (error) {
		res.status(500).send({ success: false, message: "伺服器發生錯誤" });
	}
});

router.delete("/", async (req, res) => {
	const { position, level } = req.body;
	const data = { position, level };

	try {
		const [records, field] = await positions.deleteOne(data, ["position"]);
		update(positions.tableName);
		res.send({ success: true, data: records });
	} catch (error) {
		res.status(500).send({ success: false, message: "伺服器發生錯誤" });
	}
});

module.exports = router;
