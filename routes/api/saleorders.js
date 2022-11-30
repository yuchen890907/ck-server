const saleorders = require("../../database/models").saleorders;
const validation = require("../../database/validation");
const { update } = require("../../service/webSocket");
const router = require("express").Router();

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

router.post("/", async (req, res) => {
  const { saleInvoice, saleDateTime, orderTime, completeTime, forHere, count, total, payment, status } = req.body;
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
  };

  let { error } = validation.saleordersValidation(data);

  if (error) {
    return res.status(403).send({ success: false, message: error.details[0].message });
  }

  try {
    const [records, field] = await saleorders.insertOne(data);
    update(saleorders.tableName);
    res.send({ success: true, data: records });
  } catch (error) {
    res.status(500).send({ success: false, message: "伺服器發生錯誤" });
  }
});

router.put("/", async (req, res) => {
  const { saleInvoice, saleDateTime, orderTime, completeTime, forHere, count, total, payment, status } = req.body;
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
  };

  let { error } = validation.saleordersValidation(data);

  if (error) {
    return res.status(403).send({ success: false, message: error.details[0].message });
  }

  try {
    const [records, field] = await saleorders.updateOne(data, ["saleInvoice"]);
    update(saleorders.tableName);
    res.send({ success: true, data: records });
  } catch (error) {
    res.status(500).send({ success: false, message: "伺服器發生錯誤" });
  }
});

router.delete("/", async (req, res) => {
  const { saleInvoice, saleDateTime, orderTime, completeTime, forHere, count, total, payment, status } = req.body;
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
  };

  try {
    const [records, field] = await saleorders.deleteOne(data, ["saleInvoice"]);
    update(saleorders.tableName);
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
    const [records, field] = await saleorders.insertMany(data);
    update(saleorders.tableName);
    res.send({ success: true, data: records });
  } catch (error) {
    res.status(500).send({ success: false, message: "伺服器發生錯誤" });
  }
});

module.exports = router;
