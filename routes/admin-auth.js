const employees = require("../database/models").employees;
const validation = require("../database/validation");

const bcrypt = require("bcrypt");
const router = require("express").Router();

router.post("/register", async (req, res) => {
  const { account, password, name, sex, phone, email, position, salary } =
    req.body;

  bcrypt.hash(password, 10, async (err, hash) => {
    if (err) {
      return res
        .status(500)
        .send({ success: false, message: "伺服器發生錯誤", error: err });
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
      enrollmentDate: new Date().toISOString().slice(0, 10).replace("T", " "),
    };

    const { error } = validation.employeesValidation(data);
    if (error) {
      return res
        .status(403)
        .send({ success: false, message: error.details[0].message });
    }
    try {
      const [result] = await employees.insertOne(data);
      if (result) {
        res.send({ success: true, message: "資料新增成功" });
      } else {
        res.status(500).send({ success: false, message: "未新增任何資料" });
      }
    } catch (err) {
      res.status(500).send({ success: false, message: "未新增任何資料" });
    }
  });
});

router.get("/", (req, res) => {
  const db = req.db;

  qur = db.query("SELECT * FROM employees", (err, data) => {
    if (err) {
      console.log("新增錯誤");
      console.log(err);
      res.send(err);
    } else {
      console.log("註冊成功");
      console.log(data);
      res.send(data);
    }
  });
});

module.exports = router;
