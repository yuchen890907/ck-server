const employees = require("../../database/models").employees;
const validation = require("../../database/validation");
const bcrypt = require("bcrypt");
const dbConnection = require("../../database/databaseConnection");
const { update } = require("../../service/webSocket");
const router = require("express").Router();

router.get("/", async (req, res) => {
  try {
    const [records, field] = await employees.findAll();
    const { labels, schemas } = await employees.getSchema();
    records.forEach((record, i) => {
      tzoffset = new Date().getTimezoneOffset() * 60000;
      records[i].enrollmentDate = new Date(records[i].enrollmentDate - tzoffset)
        .toISOString()
        .slice(0, 10)
        .replace("T", " ");
      if (records[i].resignationDate)
        records[i].resignationDate = new Date(records[i].resignationDate - tzoffset)
          .toISOString()
          .slice(0, 10)
          .replace("T", " ");
      else records[i].resignationDate = "";
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
  const { account, password, name, sex, phone, email, position, salary, enrollmentDate } = req.body;

  bcrypt.hash(password, 10, async (err, hash) => {
    if (err) {
      return res.status(500).send({ success: false, message: "伺服器發生錯誤", error: err });
    }

    const data = {
      account,
      password: hash,
      name,
      sex,
      phone,
      email,
      position,
      salary,
      enrollmentDate,
    };

    const { error } = validation.employeesValidation(data);
    if (error) {
      return res.status(403).send({ success: false, message: error.details[0].message });
    }
    try {
      const [result] = await employees.insertOne(data);
      if (result) {
        update(employees.tableName);
        res.send({ success: true, message: "資料新增成功" });
      } else {
        res.status(500).send({ success: false, message: "未新增任何資料" });
      }
    } catch (err) {
      res.status(500).send({ success: false, message: "未新增任何資料" });
    }
  });
});

router.put("/", async (req, res) => {
  const { account, password, name, sex, phone, email, position, salary, enrollmentDate, resignationDate } = req.body;

  let data = {
    account,
    password,
    name,
    sex,
    phone,
    email,
    position,
    salary,
    enrollmentDate,
  };

  if (resignationDate) data.resignationDate = resignationDate;

  let { error } = validation.employeesValidation(data);

  if (error) {
    return res.status(403).send({ success: false, message: error.details[0].message });
  }

  if (!resignationDate) data.resignationDate = null;

  try {
    const [records, field] = await employees.updateOne(data, ["account"]);
    update(employees.tableName);
    res.send({ success: true, data: records });
  } catch (error) {
    res.status(500).send({ success: false, message: "伺服器發生錯誤" });
  }
});

router.patch("/password", async (req, res) => {
  const account = req.user.account;
  const { password, originalPassword } = req.body;
  try {
    const [records, field] = await employees.findOne(account);
    if (records.length > 0) {
      //登入檢查
      const isMatch = await bcrypt.compare(originalPassword, records[0].password);
      if (isMatch) {
        bcrypt.hash(password, 10, async (err, hash) => {
          if (err) return res.status(500).send({ success: false, message: "伺服器發生錯誤", error: err });

          const [records, field] = await dbConnection.query(`UPDATE employees SET password = ? WHERE account = ?;`, [
            hash,
            account,
          ]);

          res.send({ success: true, data: records });
        });
      } else res.status(403).send({ success: false, message: "使用者密碼錯誤" });
    }
  } catch (error) {
    res.status(500).send({ success: false, message: "伺服器發生錯誤" });
  }
});

router.delete("/", async (req, res) => {
  const { account, password, name, sex, phone, email, position, salary, enrollmentDate, resignationDate } = req.body;

  const data = {
    account,
    password,
    name,
    sex,
    phone,
    email,
    position,
    salary,
    enrollmentDate,
    resignationDate,
  };

  try {
    const [records, field] = await employees.deleteOne(data, ["account"]);
    update(employees.tableName);
    res.send({ success: true, data: records });
  } catch (error) {
    res.status(500).send({ success: false, message: "伺服器發生錯誤" });
  }
});

module.exports = router;
