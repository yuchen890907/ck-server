const purchaseorders = require("../../database/models").purchaseorders;
const validation = require("../../database/validation");
const { update } = require("../../service/webSocket");
const router = require("express").Router();

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

router.post("/", async (req, res) => {
  const { purchaseInvoice, purchaseDateTime, total, eAccount, sPhone } = req.body;
  const data = {
    purchaseInvoice,
    purchaseDateTime,
    total,
    eAccount,
    sPhone,
  };

  let { error } = validation.purchaseordersValidation(data);

  if (error) {
    return res.status(403).send({ success: false, message: error.details[0].message });
  }

  try {
    const [records, field] = await purchaseorders.insertOne(data);
    update(purchaseorders.tableName);
    res.send({ success: true, data: records });
  } catch (error) {
    res.status(500).send({ success: false, message: "伺服器發生錯誤" });
  }
});

router.put("/", async (req, res) => {
  const { purchaseInvoice, purchaseDateTime, total, eAccount, sPhone } = req.body;
  const data = {
    purchaseInvoice,
    purchaseDateTime,
    total,
    eAccount,
    sPhone,
  };

  let { error } = validation.purchaseordersValidation(data);

  if (error) {
    return res.status(403).send({ success: false, message: error.details[0].message });
  }

  try {
    const [records, field] = await purchaseorders.updateOne(data, ["purchaseInvoice"]);
    update(purchaseorders.tableName);
    res.send({ success: true, data: records });
  } catch (error) {
    res.status(500).send({ success: false, message: "伺服器發生錯誤" });
  }
});

router.delete("/", async (req, res) => {
  const { purchaseInvoice, purchaseDateTime, total, eAccount, sPhone } = req.body;
  const data = {
    purchaseInvoice,
    purchaseDateTime,
    total,
    eAccount,
    sPhone,
  };

  try {
    const [records, field] = await purchaseorders.deleteOne(data, ["purchaseInvoice"]);
    update(purchaseorders.tableName);
    res.send({
      success: true,
      data: records,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: "伺服器發生錯誤" });
  }
});

module.exports = router;
