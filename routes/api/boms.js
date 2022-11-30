const boms = require("../../database/models").boms;
const validation = require("../../database/validation");
const { update } = require("../../service/webSocket");
const router = require("express").Router();

router.get("/", async (req, res) => {
  try {
    const [records, field] = await boms.findAll();
    const { labels, schemas } = await boms.getSchema();
    res.send({
      success: true,
      data: { data: records, labels: labels, schemas: schemas },
    });
  } catch (error) {
    res.status(500).send({ success: false, message: "伺服器發生錯誤" });
  }
});

router.post("/", async (req, res) => {
  const { productNo, genericgoodNo, quantity, unit } = req.body;
  const data = {
    productNo,
    genericgoodNo,
    quantity,
    unit
  };

  let { error } = validation.bomsValidation(data);

  if (error) {
    return res
      .status(403)
      .send({ success: false, message: error.details[0].message });
  }

  try {
    const [records, field] = await boms.insertOne(data);
    update(boms.tableName);
    res.send({ success: true, data: records });
  } catch (error) {
    res.status(500).send({ success: false, message: "伺服器發生錯誤" });
  }
});

router.put("/", async (req, res) => {
  const { productNo, genericgoodNo, quantity, unit } = req.body;
  const data = {
    productNo,
    genericgoodNo,
    quantity,
    unit
  };

  let { error } = validation.bomsValidation(data);

  if (error) {
    return res
      .status(403)
      .send({ success: false, message: error.details[0].message });
  }

  try {
    const [records, field] = await boms.updateOne(data, ["productNo", "genericgoodNo"]);
    update(boms.tableName);
    res.send({ success: true, data: records });
  } catch (error) {
    res.status(500).send({ success: false, message: "伺服器發生錯誤" });
  }
});

router.delete("/", async (req, res) => {
  const { productNo, genericgoodNo, quantity, unit } = req.body;
  const data = {
    productNo,
    genericgoodNo,
    quantity,
    unit
  };

  try {
    const [records, field] = await boms.deleteOne(data, ["productNo", "genericgoodNo"]);
    update(boms.tableName);
    res.send({
      success: true,
      data: records,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: "伺服器發生錯誤" });
  }
});

module.exports = router;
