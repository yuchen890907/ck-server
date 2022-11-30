const guides = require("../../database/models").guides;
const permissionMiddleware = require("../../config/middleware");
const validation = require("../../database/validation");
const { update } = require("../../service/webSocket");
const router = require("express").Router();

const urlParser = (url) => {
	const host = `${process.env.HOST || `localhost${process.env.PORT && `:${process.env.PORT}`}`}`;
	// console.log(url.replace("http://localhost", host));
	return url.replace("http://localhost", host);
};
router.use(permissionMiddleware);
router.get("/", async (req, res) => {
	try {
		const [records, field] = await guides.findAll();
		const { labels, schemas } = await guides.getSchema();
		records.forEach((record, i) => {
			tzoffset = new Date().getTimezoneOffset() * 60000;
			records[i].updateDateTime = new Date(records[i].updateDateTime - tzoffset)
				.toISOString()
				.slice(0, 19)
				.replace("T", " ");
			records[i].file = urlParser(record.file);
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
	const { title, file } = req.body;
	let now = new Date();
	let tzoffset = new Date().getTimezoneOffset() * 60000;
	const data = {
		updateDateTime: new Date(now - tzoffset).toISOString().slice(0, 19).replace("T", " "),
		title,
		file,
		eAccount: req.user.account,
	};

	let { error } = validation.guidesValidation(data);
	if (error) {
		return res.status(403).send({ success: false, message: error.details[0].message });
	}

	try {
		const [records, field] = await guides.insertOne(data);
		update(guides.tableName);
		res.send({ success: true, data: records });
	} catch (error) {
		res.status(500).send({ success: false, message: "伺服器發生錯誤" });
	}
});

router.put("/", async (req, res) => {
	const { dataID, title, file } = req.body;
	let now = new Date();
	let tzoffset = new Date().getTimezoneOffset() * 60000;
	const data = {
		dataID,
		updateDateTime: new Date(now - tzoffset).toISOString().slice(0, 19).replace("T", " "),
		title,
		file,
		eAccount: req.user.account,
	};

	let { error } = validation.guidesValidation(data);

	if (error) {
		return res.status(403).send({ success: false, message: error.details[0].message });
	}

	try {
		const [records, field] = await guides.updateOne(data, ["dataID"]);
		update(guides.tableName);
		res.send({ success: true, data: records });
	} catch (error) {
		res.status(500).send({ success: false, message: "伺服器發生錯誤" });
	}
});

router.delete("/", async (req, res) => {
	const { dataID, updateDateTime, title, file, eAccount } = req.body;
	const data = {
		dataID,
		updateDateTime,
		title,
		file,
		eAccount,
	};

	try {
		const [records, field] = await guides.deleteOne(data, ["dataID"]);
		update(guides.tableName);
		res.send({ success: true, data: records });
	} catch (error) {
		res.status(500).send({ success: false, message: "伺服器發生錯誤" });
	}
});

module.exports = router;
