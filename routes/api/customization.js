const customization = require("../../database/models").customization;
const dbConnection = require("../../database/databaseConnection");
const validation = require("../../database/validation");
const { update } = require("../../service/webSocket");
const router = require("express").Router();

router.get("/", async (req, res) => {
  try {
    const [records, field] = await customization.findAll();
    const { labels, schemas } = await customization.getSchema();
    res.send({
      success: true,
      data: { data: records, labels: labels, schemas: schemas },
    });
  } catch (error) {
    res.status(500).send({ success: false, message: "伺服器發生錯誤" });
  }
});

router.post("/", async (req, res) => {
  const { item, content, price } = req.body;
  const data = {
    item,
    content,
    price,
  };

  let { error } = validation.customizationValidation(data);

  if (error) {
    return res.status(403).send({ success: false, message: error.details[0].message });
  }

  try {
    const [records, field] = await customization.insertOne(data);
    update(customization.tableName);
    res.send({ success: true, data: records });
  } catch (error) {
    res.status(500).send({ success: false, message: "伺服器發生錯誤" });
  }
});

router.put("/", async (req, res) => {
  const { item, content, price, originContent } = req.body;
  const data = {
    item,
    content,
    price,
  };

  let { error } = validation.customizationValidation(data);

  if (error) {
    return res.status(403).send({ success: false, message: error.details[0].message });
  }

  try {
    const [records, field] = await dbConnection.query(
      `UPDATE customization SET content = '${content}', price = '${price}' WHERE item = '${item}' AND content = '${originContent}';`
    );
    update(customization.tableName);
    res.send({ success: true, data: records });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "伺服器發生錯誤" });
  }
});

router.delete("/", async (req, res) => {
  const { item, content, price } = req.body;
  const data = {
    item,
    content,
    price,
  };

  try {
    const [records, field] = await customization.deleteOne(data, ["item", "content"]);
    update(customization.tableName);
    res.send({
      success: true,
      data: records,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: "伺服器發生錯誤" });
  }
});

module.exports = router;
