const saleorders = require("../../database/models").saleorders;
const saledetails = require("../../database/models").saledetails;
const validation = require("../../database/validation");
const dbConnection = require("../../database/databaseConnection");
const { update } = require("../../service/webSocket");
const permissionMiddleware = require("../../config/middleware");
const router = require("express").Router();
const tableName = "sales";
router.use(permissionMiddleware);
router.get("/", async (req, res) => {
	try {
		const [records, field] = await saleorders.findAll();
		const { labels, schemas } = await saleorders.getSchema();
		records.forEach((record, i) => {
			tzoffset = new Date().getTimezoneOffset() * 60000;
			records[i].saleDateTime = new Date(records[i].saleDateTime - tzoffset)
				.toISOString()
				.slice(0, 10)
				.replace("T", " ");
		});
		res.send({
			success: true,
			data: { data: records, labels: labels, schemas: schemas },
		});
	} catch (error) {
		res.status(500).send({ success: false, message: "伺服器發生錯誤" });
	}
});

router.get("/saleInvoice/:invoice", async (req, res) => {
	const { invoice } = req.params;
	try {
		const sql = `SELECT d.itemNo, p.productName, d.quantity, d.unitPrice, d.remarks FROM saledetails AS d, products AS p 
    WHERE d.productNo = p.productNo AND d.saleInvoice = '${invoice}';`;
		const [records, fields] = await dbConnection.query(sql);
		const labels = ["項目", "商品", "數量", "單價", "備註"];
		const schemas = ["itemNo", "productName", "quantity", "unitPrice", "remarks"];
		res.send({
			success: true,
			data: { data: records, labels, schemas },
		});
	} catch (error) {
		res.status(500).send({ success: false, message: "伺服器發生錯誤" });
	}
});

router.post("/", async (req, res) => {
	const { saleInvoice, saleDateTime, orderTime, completeTime, forHere, count, total, payment, status, details } = req.body;
	const data = {
		saleInvoice,
		saleDateTime,
		orderTime,
		completeTime,
		forHere,
		count,
		total,
		payment,
		status,
		details,
	};

	let { error } = validation.salesValidation(data);

	if (error) {
		return res.status(403).send({ success: false, message: error.details[0].message });
	}

	try {
		const [records] = await saleorders.findOne(saleInvoice);
		if (records.length > 0) return res.status(403).send({ success: false, message: "您輸入的訂單編號已存在" });

		let order_data = { saleInvoice, saleDateTime, orderTime, completeTime, forHere, count, total, payment, status };
		let details_dataSet = details.map((detail) => {
			return {
				saleInvoice,
				itemNo: detail.itemNo,
				productNo: detail.productNo,
				quantity: detail.quantity,
				unitPrice: detail.unitPrice,
				remarks: detail.remarks,
			};
		});

		const [order_records, order_field] = await saleorders.insertOne(order_data);
		const [details_records, details_field] = await saledetails.insertMany(details_dataSet);
		update(tableName);
		res.send({ success: true, data: records });
	} catch (error) {
		res.status(500).send({ success: false, message: "伺服器發生錯誤" });
	}
});

module.exports = router;
