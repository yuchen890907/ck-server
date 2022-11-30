const sopform = require("../../database/models").sopform;
const validation = require("../../database/validation");
const { update } = require("../../service/webSocket");
const router = require("express").Router();

router.get("/", async (req, res) => {
  try {
    const [records, field] = await sopform.findAll();
    const { labels, schemas } = await sopform.getSchema();
    res.send({
      success: true,
      data: { data: records, labels, schemas },
    });
  } catch (error) {
    res.status(500).send({ success: false, message: "伺服器發生錯誤" });
  }
});

router.post("/", async (req, res) => {
  const { sopClass, content } = req.body;
  const data = {
    sopClass,
    content,
  };

  let { error } = validation.sopformValidation(data);

  if (error) {
    return res.status(403).send({ success: false, message: error.details[0].message });
  }

  try {
    const [records, field] = await sopform.insertOne(data);
    update(sopform.tableName);
    res.send({ success: true, data: records });
  } catch (error) {
    res.status(500).send({ success: false, message: "伺服器發生錯誤" });
  }
});

router.put("/", async (req, res) => {
  const { sopClass, content } = req.body;
  const data = {
    sopClass,
    content,
  };

  let { error } = validation.sopformValidation(data);

  if (error) {
    return res.status(403).send({ success: false, message: error.details[0].message });
  }

  try {
    const [records, field] = await sopform.updateOne(data, ["sopClass", "content"]);
    update(sopform.tableName);
    res.send({ success: true, data: records });
  } catch (error) {
    res.status(500).send({ success: false, message: "伺服器發生錯誤" });
  }
});

router.delete("/", async (req, res) => {
  const { sopClass, content } = req.body;
  const data = {
    sopClass,
    content,
  };

  try {
    const [records, field] = await sopform.deleteOne(data, ["sopClass", "content"]);
    update(sopform.tableName);
    res.send({ success: true, data: records });
  } catch (error) {
    res.status(500).send({ success: false, message: "伺服器發生錯誤" });
  }
});

module.exports = router;
