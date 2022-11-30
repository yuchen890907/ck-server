const purchaseorders = require("../../database/models").purchaseorders;
const purchasedetails = require("../../database/models").purchasedetails;
const validation = require("../../database/validation");
const dbConnection = require("../../database/databaseConnection");
const { update } = require("../../service/webSocket");
const router = require("express").Router();
const tableName = "purchases";

router.get("/", async (req, res) => {
  try {
    const [records, field] = await purchaseorders.findAll();
    const { labels, schemas } = await purchaseorders.getSchema();
    records.forEach((record, i) => {
      tzoffset = new Date().getTimezoneOffset() * 60000;
      records[i].purchaseDateTime = new Date(records[i].purchaseDateTime - tzoffset)
        .toISOString()
        .slice(0, 19)
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

router.get("/purchaseInvoice/:invoice", async (req, res) => {
  const { invoice } = req.params;
  try {
    const sql = `SELECT g.genericgoodName, p.quantity, g.unit, p.unitPrice FROM purchasedetails AS p, genericgoods AS g 
    WHERE p.genericgoodNo = g.genericgoodNo AND p.purchaseInvoice = '${invoice}';`;
    const [records, fields] = await dbConnection.query(sql);
    const labels = ["原物料名稱", "數量", "單位", "單價"];
    const schemas = ["genericgoodName", "quantity", "unit", "unitPrice"];
    res.send({
      success: true,
      data: { data: records, labels, schemas },
    });
  } catch (error) {
    res.status(500).send({ success: false, message: "伺服器發生錯誤" });
  }
});

router.post("/", async (req, res) => {
  const { purchaseInvoice, purchaseDateTime, total, sPhone, details } = req.body;
  const data = {
    purchaseInvoice,
    purchaseDateTime,
    total,
    eAccount: req.user.account,
    sPhone,
    details,
  };

  let { error } = validation.purchasesValidation(data);

  if (error) {
    return res.status(403).send({ success: false, message: error.details[0].message });
  }

  try {
    const [records] = await purchaseorders.findOne(purchaseInvoice);
    if (records.length > 0) return res.status(403).send({ success: false, message: "您輸入的進貨編號已存在" });

    let order_data = { purchaseInvoice, purchaseDateTime, total, eAccount: req.user.account, sPhone };
    let details_dataSet = details.map((detail) => {
      return {
        purchaseInvoice,
        genericgoodNo: detail.genericgoodNo,
        quantity: detail.quantity,
        unitPrice: detail.unitPrice,
      };
    });

    const [order_records, order_field] = await purchaseorders.insertOne(order_data);
    const [details_records, details_field] = await purchasedetails.insertMany(details_dataSet);
    // update(purchaseorders.tableName);
    // update(purchasedetails.tableName);
    update(tableName);
    res.send({ success: true, data: records });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "伺服器發生錯誤" });
  }
});

module.exports = router;
