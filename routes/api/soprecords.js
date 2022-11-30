const soprecords = require("../../database/models").soprecords;
const sopform = require("../../database/models").sopform;
const dbConnection = require("../../database/databaseConnection");
const validation = require("../../database/validation");
const { update } = require("../../service/webSocket");
const router = require("express").Router();

router.get("/", async (req, res) => {
  try {
    const sql = `SELECT DISTINCT registerDateTime,sopClass,eAccount FROM soprecords
    WHERE registerDateTime IN (SELECT registerDateTime FROM soprecords);`;
    // const [records, field] = await soprecords.findAll();
    // const { labels, schemas } = await soprecords.getSchema();
    const [records, field] = await dbConnection.query(sql);
    const labels = ["編輯時間", "類別", "員工"];
    const schemas = ["registerDateTime", "sopClass", "eAccount"];
    records.forEach((record, i) => {
      tzoffset = new Date().getTimezoneOffset() * 60000;
      records[i].registerDateTime = new Date(records[i].registerDateTime - tzoffset)
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
    });
    res.send({
      success: true,
      data: { data: records, labels, schemas },
    });
  } catch (error) {
    res.status(500).send({ success: false, message: "伺服器發生錯誤" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { data } = req.body;
    const [sopform_records, sopform_field] = await sopform.findAll();

    let tzoffset = new Date().getTimezoneOffset() * 60000;
    let now = new Date(new Date() - tzoffset).toISOString().slice(0, 19).replace("T", " ");

    if (data) {
      sopform_records
        .filter((record) => record.sopClass === data[0].sopClass)
        .forEach((record) => {
          if (data.findIndex((item) => item.content === record.content) === -1)
            return res.status(403).send({ success: false, message: "還敢偷懶阿" });
        });
    }

    const dataSet = data.map((record) => {
      return { registerDateTime: now, ...record, eAccount: req.user.account };
    });

    let { error } = validation.soprecordsValidation(dataSet);

    if (error) {
      console.log(error);
      return res.status(403).send({ success: false, message: error.details[0].message });
    }

    const [records, field] = await soprecords.insertMany(dataSet);
    update(soprecords.tableName);
    res.send({ success: true, data: sopform_records });
  } catch (error) {
    res.status(500).send({ success: false, message: "伺服器發生錯誤" });
  }
});

router.put("/", async (req, res) => {
  const { registerDateTime, sopClass, content, eAccount } = req.body;
  const data = {
    registerDateTime,
    sopClass,
    content,
    eAccount,
  };

  let { error } = validation.soprecordsValidation(data);

  if (error) {
    return res.status(403).send({ success: false, message: error.details[0].message });
  }

  try {
    const [records, field] = await soprecords.updateOne(data, ["registerDateTime", "sopClass", "content"]);
    update(soprecords.tableName);
    res.send({ success: true, data: records });
  } catch (error) {
    res.status(500).send({ success: false, message: "伺服器發生錯誤" });
  }
});

router.delete("/", async (req, res) => {
  const { registerDateTime, sopClass, content, eAccount } = req.body;
  const data = {
    registerDateTime,
    sopClass,
    content,
    eAccount,
  };

  try {
    const [records, field] = await soprecords.deleteOne(data, ["registerDateTime", "sopClass", "content"]);
    update(soprecords.tableName);
    res.send({ success: true, data: records });
  } catch (error) {
    res.status(500).send({ success: false, message: "伺服器發生錯誤" });
  }
});

module.exports = router;
