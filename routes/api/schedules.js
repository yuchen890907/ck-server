const schedules = require("../../database/models").schedules;
const permissionMiddleware = require("../../config/middleware");
const validation = require("../../database/validation");
const { update } = require("../../service/webSocket");
const router = require("express").Router();
router.use(permissionMiddleware);
router.get("/", async (req, res) => {
	try {
		const [records, field] = await schedules.findAll();
		const { labels, schemas } = await schedules.getSchema();
		records.forEach((record, i) => {
			tzoffset = new Date().getTimezoneOffset() * 60000;
			records[i].workDate = new Date(records[i].workDate - tzoffset).toISOString().slice(0, 10).replace("T", " ");
		});
		res.send({
			success: true,
			data: { data: records, labels, schemas },
		});
	} catch (error) {
		res.status(500).send({ success: false, message: "伺服器發生錯誤" });
	}
});

router.post("/", async (req, res) => {
	const { workDate, start, leave, eAccount, job, remarks } = req.body;
	const data = {
		workDate,
		start,
		leave,
		eAccount,
		job,
		remarks,
	};

	let { error } = validation.schedulesValidation(data);

	if (error) {
		return res.status(403).send({ success: false, message: error.details[0].message });
	}

	try {
		const [records, field] = await schedules.insertOne(data);
		update(schedules.tableName);
		res.send({ success: true, data: records });
	} catch (error) {
		res.status(500).send({ success: false, message: "伺服器發生錯誤" });
	}
});

router.put("/", async (req, res) => {
	const { scheduleNo, workDate, start, leave, eAccount, job, remarks } = req.body;
	const data = {
		scheduleNo,
		workDate,
		start,
		leave,
		eAccount,
		job,
		remarks,
	};

	let { error } = validation.schedulesValidation(data);
	if (error) {
		return res.status(403).send({ success: false, message: error.details[0].message });
	}

	try {
		const [records, field] = await schedules.updateOne(data, ["scheduleNo"]);
		update(schedules.tableName);
		res.send({ success: true, data: records });
	} catch (error) {
		res.status(500).send({ success: false, message: "伺服器發生錯誤" });
	}
});

router.delete("/", async (req, res) => {
	const { scheduleNo, workDate, start, leave, eAccount, job, remarks } = req.body;
	const data = {
		scheduleNo,
		workDate,
		start,
		leave,
		eAccount,
		job,
		remarks,
	};

	try {
		const [records, field] = await schedules.deleteOne(data, ["scheduleNo"]);
		update(schedules.tableName);
		res.send({ success: true, data: records });
	} catch (error) {
		res.status(500).send({ success: false, message: "伺服器發生錯誤" });
	}
});

module.exports = router;
