const seats = require("../../database/models").seats;
const validation = require("../../database/validation");
const { update } = require("../../service/webSocket");
const router = require("express").Router();

router.get("/", async (req, res) => {
  try {
    const [records, field] = await seats.findAll();
    const { labels, schemas } = await seats.getSchema();
    res.send({
      success: true,
      data: { data: records, labels, schemas },
    });
  } catch (error) {
    res.status(500).send({ success: false, message: "伺服器發生錯誤" });
  }
});

router.post("/", async (req, res) => {
  const { tableNo, capacity } = req.body;
  const data = {
    tableNo,
    capacity,
  };

  let { error } = validation.seatsValidation(data);
  console.log(error);
  if (error) {
    return res.status(403).send({ success: false, message: error.details[0].message });
  }

  try {
    const [records, field] = await seats.insertOne(data);
    update(seats.tableName);
    res.send({ success: true, data: records });
  } catch (error) {
    res.status(500).send({ success: false, message: "伺服器發生錯誤" });
  }
});

router.put("/", async (req, res) => {
  const { tableNo, capacity } = req.body;
  const data = {
    tableNo,
    capacity,
  };

  let { error } = validation.seatsValidation(data);

  if (error) {
    return res.status(403).send({ success: false, message: error.details[0].message });
  }

  try {
    const [records, field] = await seats.updateOne(data, ["tableNo"]);
    update(seats.tableName);
    res.send({ success: true, data: records });
  } catch (error) {
    res.status(500).send({ success: false, message: "伺服器發生錯誤" });
  }
});

router.delete("/", async (req, res) => {
  const { tableNo, capacity } = req.body;
  const data = {
    tableNo,
    capacity,
  };

  try {
    const [records, field] = await seats.deleteOne(data, ["tableNo"]);
    update(seats.tableName);
    res.send({ success: true, data: records });
  } catch (error) {
    res.status(500).send({ success: false, message: "伺服器發生錯誤" });
  }
});

module.exports = router;
