const productclasses = require("../../database/models").productclasses;
const validation = require("../../database/validation");
const { update } = require("../../service/webSocket");
const router = require("express").Router();

router.get("/", async (req, res) => {
  try {
    const [records, field] = await productclasses.findAll();
    const { labels, schemas } = await productclasses.getSchema();
    res.send({
      success: true,
      data: { data: records, labels: labels, schemas: schemas },
    });
  } catch (error) {
    res.status(500).send({ success: false, message: "伺服器發生錯誤" });
  }
});

router.post("/", async (req, res) => {
  const { classNo, className } = req.body;
  const data = {
    classNo,
    className,
  };

  let { error } = validation.productclassesValidation(data);

  if (error) {
    return res.status(403).send({ success: false, message: error.details[0].message });
  }

  try {
    const [records, field] = await productclasses.insertOne(data);
    update(productclasses.tableName);
    res.send({ success: true, data: records });
  } catch (error) {
    res.status(500).send({ success: false, message: "伺服器發生錯誤" });
  }
});

router.put("/", async (req, res) => {
  const { classNo, className } = req.body;
  const data = {
    classNo,
    className,
  };

  let { error } = validation.productclassesValidation(data);

  if (error) {
    return res.status(403).send({ success: false, message: error.details[0].message });
  }

  try {
    const [records, field] = await productclasses.updateOne(data, ["classNo"]);
    update(productclasses.tableName);
    res.send({ success: true, data: records });
  } catch (error) {
    res.status(500).send({ success: false, message: "伺服器發生錯誤" });
  }
});

router.delete("/", async (req, res) => {
  const { classNo, className } = req.body;
  const data = {
    classNo,
    className,
  };

  try {
    const [records, field] = await productclasses.deleteOne(data, ["classNo"]);
    update(productclasses.tableName);
    res.send({
      success: true,
      data: records,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: "伺服器發生錯誤" });
  }
});
module.exports = router;
