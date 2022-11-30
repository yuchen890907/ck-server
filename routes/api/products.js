const products = require("../../database/models").products;
const validation = require("../../database/validation");
const { update } = require("../../service/webSocket");
const router = require("express").Router();

const urlParser = (url) => {
  if (url) {
    const host = `${process.env.HOST || `http://localhost${process.env.PORT && `:${process.env.PORT}`}`}`;
    return url.replace("http://localhost", host);
  }
};

router.get("/", async (req, res) => {
  try {
    const [records, field] = await products.findAll();
    const { labels, schemas } = await products.getSchema();
    records.forEach((record, i) => {
      records[i].img = urlParser(record.img);
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
  const { productNo, productName, unitPrice, img, classNo } = req.body;
  const data = {
    productNo,
    productName,
    unitPrice,
    img,
    classNo,
  };

  let { error } = validation.productsValidation(data);

  if (error) {
    return res.status(403).send({ success: false, message: error.details[0].message });
  }

  try {
    const [records, field] = await products.insertOne(data);
    update(products.tableName);
    res.send({ success: true, data: records });
  } catch (error) {
    res.status(500).send({ success: false, message: "伺服器發生錯誤" });
  }
});

router.put("/", async (req, res) => {
  const { productNo, productName, unitPrice, img, classNo } = req.body;
  const data = {
    productNo,
    productName,
    unitPrice,
    img,
    classNo,
  };

  let { error } = validation.productsValidation(data);

  if (error) {
    return res.status(403).send({ success: false, message: error.details[0].message });
  }

  try {
    const [records, field] = await products.updateOne(data, ["productNo"]);
    update(products.tableName);
    res.send({ success: true, data: records });
  } catch (error) {
    res.status(500).send({ success: false, message: "伺服器發生錯誤" });
  }
});

router.delete("/", async (req, res) => {
  const { productNo, productName, unitPrice, img, classNo } = req.body;
  const data = {
    productNo,
    productName,
    unitPrice,
    img,
    classNo,
  };

  try {
    const [records, field] = await products.deleteOne(data, ["productNo"]);
    update(products.tableName);
    res.send({
      success: true,
      data: records,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: "伺服器發生錯誤" });
  }
});

module.exports = router;
