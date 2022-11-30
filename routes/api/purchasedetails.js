const purchasedetails = require("../../database/models").purchasedetails;
const validation = require("../../database/validation");
const { update } = require("../../service/webSocket");
const router = require("express").Router();

router.get("/", async (req, res) => {
  try {
    const [records, field] = await purchasedetails.findAll();
    const { labels, schemas } = await purchasedetails.getSchema();
    res.send({
      success: true,
      data: { data: records, labels: labels, schemas: schemas },
    });
  } catch (error) {
    res.status(500).send({ success: false, message: "伺服器發生錯誤" });
  }
});

router.post("/", async (req, res) => {
  const { purchaseInvoice, genericgoodNo, quantity, unitPrice } = req.body;
  const data = {
    purchaseInvoice,
    genericgoodNo,
    quantity,
    unitPrice,
  };

  let { error } = validation.purchasedetailsValidation(data);

  if (error) {
    return res.status(403).send({ success: false, message: error.details[0].message });
  }

  try {
    const [records, field] = await purchasedetails.insertOne(data);
    update(purchasedetails.tableName);
    res.send({ success: true, data: records });
  } catch (error) {
    res.status(500).send({ success: false, message: "伺服器發生錯誤" });
  }
});

router.put("/", async (req, res) => {
  const { purchaseInvoice, genericgoodNo, quantity, unitPrice } = req.body;
  const data = {
    purchaseInvoice,
    genericgoodNo,
    quantity,
    unitPrice,
  };

  let { error } = validation.purchasedetailsValidation(data);

  if (error) {
    return res.status(403).send({ success: false, message: error.details[0].message });
  }

  try {
    const [records, field] = await purchasedetails.updateOne(data, ["purchaseInvoice", "genericgoodNo"]);
    update(purchasedetails.tableName);
    res.send({ success: true, data: records });
  } catch (error) {
    res.status(500).send({ success: false, message: "伺服器發生錯誤" });
  }
});

router.delete("/", async (req, res) => {
  const { purchaseInvoice, genericgoodNo, quantity, unitPrice } = req.body;
  const data = {
    purchaseInvoice,
    genericgoodNo,
    quantity,
    unitPrice,
  };

  try {
    const [records, field] = await purchasedetails.deleteOne(data, ["purchaseInvoice", "genericgoodNo"]);
    update(purchasedetails.tableName);
    res.send({
      success: true,
      data: records,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: "伺服器發生錯誤" });
  }
});

module.exports = router;
