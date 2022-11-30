const saledetails = require("../../database/models").saledetails;
const validation = require("../../database/validation");
const { update } = require("../../service/webSocket");
const router = require("express").Router();

router.get("/", async (req, res) => {
  try {
    const [records, field] = await saledetails.findAll();
    const { labels, schemas } = await saledetails.getSchema();
    res.send({
      success: true,
      data: { data: records, labels: labels, schemas: schemas },
    });
  } catch (error) {
    res.status(500).send({ success: false, message: "伺服器發生錯誤" });
  }
});

router.post("/", async (req, res) => {
  const { saleInvoice, itemNo, productNo, quantity, unitPrice, remarks } = req.body;
  const data = {
    saleInvoice,
    itemNo,
    productNo,
    quantity,
    unitPrice,
    remarks,
  };

  let { error } = validation.saledetailsValidation(data);

  if (error) {
    return res.status(403).send({ success: false, message: error.details[0].message });
  }

  try {
    const [records, field] = await saledetails.insertOne(data);
    update(saledetails.tableName);
    res.send({ success: true, data: records });
  } catch (error) {
    res.status(500).send({ success: false, message: "伺服器發生錯誤" });
  }
});

router.put("/", async (req, res) => {
  const { saleInvoice, itemNo, productNo, quantity, unitPrice, remarks } = req.body;
  const data = {
    saleInvoice,
    itemNo,
    productNo,
    quantity,
    unitPrice,
    remarks,
  };

  let { error } = validation.saledetailsValidation(data);

  if (error) {
    return res.status(403).send({ success: false, message: error.details[0].message });
  }

  try {
    const [records, field] = await saledetails.updateOne(data, ["saleInvoice", "itemNo", "productNo"]);
    update(saledetails.tableName);
    res.send({ success: true, data: records });
  } catch (error) {
    res.status(500).send({ success: false, message: "伺服器發生錯誤" });
  }
});

router.delete("/", async (req, res) => {
  const { saleInvoice, itemNo, productNo, quantity, unitPrice, remarks } = req.body;
  const data = {
    saleInvoice,
    itemNo,
    productNo,
    quantity,
    unitPrice,
    remarks,
  };

  try {
    const [records, field] = await saledetails.deleteOne(data, ["saleInvoice", "itemNo", "productNo"]);
    update(saledetails.tableName);
    res.send({
      success: true,
      data: records,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: "伺服器發生錯誤" });
  }
});

router.post("/test", async (req, res) => {
  const { data } = req.body;

  try {
    const [records, field] = await saledetails.insertMany(data);
    update(saledetails.tableName);
    res.send({ success: true, data: records });
  } catch (error) {
    res.status(500).send({ success: false, message: "伺服器發生錯誤" });
  }
});

module.exports = router;
