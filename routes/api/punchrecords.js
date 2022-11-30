const punchrecords = require("../../database/models").punchrecords;
const dbConnection = require("../../database/databaseConnection");
const validation = require("../../database/validation");
const router = require("express").Router();
const { update } = require("../../service/webSocket");

router.get("/", async (req, res) => {
  try {
    const [records, field] = await punchrecords.findAll();
    const { labels, schemas } = await punchrecords.getSchema();
    records.forEach((record, i) => {
      tzoffset = new Date().getTimezoneOffset() * 60000;
      records[i].punchDateTime = new Date(records[i].punchDateTime - tzoffset)
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

router.get("/status/:eAccount", async (req, res) => {
  try {
    const { eAccount } = req.params;
    const sql = `SELECT status FROM punchrecords WHERE eAccount = ? ORDER BY punchDateTime DESC LIMIT 1;`;
    const [records] = await dbConnection.query(sql, [eAccount]);

    //若此員工過去未有打卡紀錄，則預設狀態為下班
    if (records.length === 0) return res.send({ success: true, data: { status: "下班" } });

    res.send({ success: true, data: { status: records[0].status } });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "伺服器發生錯誤" });
  }
});

router.post("/", async (req, res) => {
  const { punchDateTime, eAccount, GPS, status, remarks } = req.body;
  const data = {
    punchDateTime,
    eAccount,
    GPS,
    status,
    remarks,
  };

  let { error } = validation.punchrecordsValidation(data);

  if (error) {
    return res.status(403).send({ success: false, message: error.details[0].message });
  }

  try {
    const [records, field] = await punchrecords.insertOne(data);
    update(punchrecords.tableName);
    res.send({ success: true, data: records });
  } catch (error) {
    res.status(500).send({ success: false, message: "伺服器發生錯誤" });
  }
});

router.post("/punch", async (req, res) => {
  const { GPS, remarks } = req.body;

  const tzoffset = new Date().getTimezoneOffset() * 60000;
  let now = new Date(new Date() - tzoffset);
  const punchDateTime = now.toISOString().slice(0, 19).replace("T", " ");
  const eAccount = req.user.account;

  try {
    const sql = `SELECT * FROM punchrecords WHERE eAccount = ? ORDER BY punchDateTime DESC LIMIT 1;`;
    const [records] = await dbConnection.query(sql, [eAccount]);

    if (records.length > 0) {
      records.forEach((record, i) => (records[i].punchDateTime = new Date(record.punchDateTime - tzoffset)));

      //-- 防止短時間多次打卡 --//
      let timeout = (now - records[0].punchDateTime) / 1000 / 60;
      if (timeout <= 60)
        return res.status(403).send({
          success: false,
          message: `你已經打過卡了，請於${Math.floor((60 - timeout) * 100) / 100}分鐘後再試`,
        });
    }

    //-- 狀態切換 --//
    let status;
    if (records.length > 0 && records[0].status === "上班") status = "下班";
    else status = "上班";

    const data = {
      punchDateTime,
      eAccount,
      GPS,
      status,
      remarks,
    };

    let { error } = validation.punchrecordsValidation(data);

    if (error) {
      return res.status(403).send({ success: false, message: error.details[0].message });
    }

    const [record, field] = await punchrecords.insertOne(data);
    update(punchrecords.tableName);
    res.send({ success: true, data: record });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "伺服器發生錯誤" });
  }
});

router.put("/", async (req, res) => {
  const { punchDateTime, eAccount, GPS, status, remarks } = req.body;
  const data = {
    punchDateTime,
    eAccount,
    GPS,
    status,
    remarks: remarks || "",
  };

  let { error } = validation.punchrecordsValidation(data);

  if (error) {
    return res.status(403).send({ success: false, message: error.details[0].message });
  }

  try {
    const [records, field] = await punchrecords.updateOne(data, ["punchDateTime", "eAccount"]);
    update(punchrecords.tableName);
    res.send({ success: true, data: records });
  } catch (error) {
    res.status(500).send({ success: false, message: "伺服器發生錯誤" });
  }
});

router.delete("/", async (req, res) => {
  const { punchDateTime, eAccount, GPS, status, remarks } = req.body;
  const data = {
    punchDateTime,
    eAccount,
    GPS,
    status,
    remarks,
  };

  try {
    const [records, field] = await punchrecords.deleteOne(data, ["punchDateTime", "eAccount"]);
    update(punchrecords.tableName);
    res.send({ success: true, data: records });
  } catch (error) {
    res.status(500).send({ success: false, message: "伺服器發生錯誤" });
  }
});

module.exports = router;
