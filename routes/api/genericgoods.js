const genericgoods = require("../../database/models").genericgoods;
const permissionMiddleware = require("../../config/middleware");
const validation = require("../../database/validation");
const { update } = require("../../service/webSocket");
const router = require("express").Router();
router.use(permissionMiddleware);
router.get("/", async (req, res) => {
	try {
		const [records, field] = await genericgoods.findAll();
		const { labels, schemas } = await genericgoods.getSchema();
		res.send({
			success: true,
			data: { data: records, labels, schemas },
		});
	} catch (error) {
		res.status(500).send({ success: false, message: "伺服器發生錯誤" });
	}
});

router.post("/", async (req, res) => {
	const { genericgoodNo, genericgoodName, unit, inventory, sale_Inventory } = req.body;
	const data = {
		genericgoodNo,
		genericgoodName,
		unit,
		inventory,
		sale_Inventory,
	};

	let { error } = validation.genericgoodsValidation(data);

	if (error) {
		return res.status(403).send({ success: false, message: error.details[0].message });
	}

	try {
		const [records, field] = await genericgoods.insertOne(data);
		update(genericgoods.tableName);
		res.send({ success: true, data: records });
	} catch (error) {
		res.status(500).send({ success: false, message: "伺服器發生錯誤" });
	}
});

router.put("/", async (req, res) => {
	const { genericgoodNo, genericgoodName, unit, inventory, sale_Inventory } = req.body;
	const data = {
		genericgoodNo,
		genericgoodName,
		unit,
		inventory,
		sale_Inventory,
	};

	let { error } = validation.genericgoodsValidation(data);

	if (error) {
		return res.status(403).send({ success: false, message: error.details[0].message });
	}

	try {
		const [records, field] = await genericgoods.updateOne(data, ["genericgoodNo"]);
		update(genericgoods.tableName);
		res.send({ success: true, data: records });
	} catch (error) {
		res.status(500).send({ success: false, message: "伺服器發生錯誤" });
	}
});

router.delete("/", async (req, res) => {
	const { genericgoodNo, genericgoodName, unit, inventory, sale_Inventory } = req.body;
	const data = {
		genericgoodNo,
		genericgoodName,
		unit,
		inventory,
		sale_Inventory,
	};

	try {
		const [records, field] = await genericgoods.deleteOne(data, ["genericgoodNo"]);
		update(genericgoods.tableName);
		res.send({ success: true, data: records });
	} catch (error) {
		res.status(500).send({ success: false, message: "伺服器發生錯誤" });
	}
});

module.exports = router;
