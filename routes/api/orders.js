const saleorders = require("../../database/models").saleorders;
const saledetails = require("../../database/models").saledetails;
const validation = require("../../database/validation");
const dbConnection = require("../../database/databaseConnection");
const { update } = require("../../service/webSocket");
const router = require("express").Router();
const tableName = "sales";
const orderList = [];

const orderListFilter = (status) => {
  return orderList.filter((order) => order.status === status);
};

router.get("/", async (req, res) => {
  const status = "製作中";
  try {
    const sql = `SELECT * FROM saleorders WHERE status = "${status}" ORDER BY saleDateTime, orderTime;`;
    const [order_records] = await dbConnection.query(sql);
    const unfinishedOrders = orderListFilter(status);
    const tzoffset = new Date().getTimezoneOffset() * 60000;
    order_records.forEach((record) => {
      record.saleDateTime = new Date(record.saleDateTime - tzoffset).toISOString().slice(0, 10);
      record.order = unfinishedOrders.find((order) => order.saleInvoice === record.saleInvoice) || null;
    });
    res.send({ success: true, data: order_records });
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, message: "伺服器發生錯誤" });
  }
});

router.patch("/status/:saleInvoice", async (req, res) => {
  const { saleInvoice } = req.params;
  const { status } = req.body;
  const tzoffset = new Date().getTimezoneOffset() * 60000;
  const now = new Date(new Date() - tzoffset);
  const completeTime = now.toISOString().slice(11, 19).replace("T", " ");
  try {
    const [order_records] = await saleorders.findOne(saleInvoice);
    if (order_records.length === 1) {
      if (status !== order_records[0].status) {
        order_records[0].status = status;
        order_records[0].completeTime = completeTime;
        const [update_record] = await saleorders.updateOne(order_records[0], ["saleInvoice"]);
        const pos = orderList.findIndex((order) => order.saleInvoice === saleInvoice);
        if (update_record.affectedRows === 1 && pos > -1) {
          orderList[pos].completeTime = completeTime;
          orderList[pos].status = status;
          res.send({ success: true, data: orderList[pos] });
        } else if (update_record.affectedRows === 1) {
          res.send({ success: true, message: "更新成功" });
        } else {
          console.log("?");
          res.status(500).send({ success: false, message: "伺服器發生錯誤" });
        }
        update("sales");
        update("orders");
      } else {
        res.send({ success: true, message: "未更新任何資料" });
      }
    } else {
      res.status(403).send({ success: false, message: "訂單不存在" });
    }
  } catch (err) {
    console.log("!!!", err);
    res.status(500).send({ success: false, message: "伺服器發生錯誤" });
  }
});

router.get("/:saleInvoice", async (req, res) => {
  console.log(orderList);
  const { saleInvoice } = req.params;
  console.log(saleInvoice);
  const pos = orderList.findIndex((item) => {
    // console.log("!!!", item);
    // console.log(item.saleInvoice === saleInvoice);
    return item.saleInvoice === saleInvoice;
  });
  // console.log("pos", pos);
  if (pos > -1) res.send({ success: true, data: orderList[pos] });
  else res.send({ success: false, message: "測試" });
});

router.post("/", async (req, res) => {
  const { order } = req.body;
  if (!order.orderInfo.name) return res.status(403).send({ success: false, message: "請輸入姓名" });
  if (!order.orderInfo.phoneNumber) return res.status(403).send({ success: false, message: "請輸入聯絡電話" });
  const tzoffset = new Date().getTimezoneOffset() * 60000;
  const now = new Date(new Date() - tzoffset);
  const saleInvoice = now.getTime().toString();
  const saleDateTime = now.toISOString().slice(0, 10).replace("T", " ");
  const orderTime = now.toISOString().slice(11, 19).replace("T", " ");
  const total = order.cartList.reduce((pre, item) => pre + item.product.price * item.product.quantity, 0);
  const status = "製作中";
  try {
    const saleorders_data = {
      saleInvoice,
      saleDateTime,
      orderTime,
      completeTime: null,
      forHere: order.orderInfo.forHere,
      count: order.orderInfo.count,
      total,
      payment: order.orderInfo.payment,
      status,
    };
    const saledetails_dataSet = order.cartList.map((item, index) => {
      return {
        saleInvoice,
        itemNo: index + 1,
        productNo: item.product.productNo,
        quantity: item.product.quantity,
        unitPrice: item.product.price,
        remarks: item.custom,
      };
    });

    let { error } = validation.ordersValidation(saleorders_data);
    if (error) return res.status(403).send({ success: false, message: error.details[0].message });
    error = validation.orderdetailsValidation(saledetails_dataSet).error;
    if (error) return res.status(403).send({ success: false, message: error.details[0].message });

    const [order_records, order_field] = await saleorders.insertOne(saleorders_data);
    const [details_records, details_field] = await saledetails.insertMany(saledetails_dataSet);
    if (order_records.affectedRows === 1 && details_records.affectedRows === order.cartList.length) {
      order.saleInvoice = saleInvoice;
      order.saleDateTime = saleDateTime;
      order.orderTime = orderTime;
      order.total = total;
      order.status = status;
      orderList.push(order);
      update("orders");
      update("saleorders");
      update("saledetails");
      res.send({ success: true, data: order });
    } else {
      res.status(500).send({ success: false, message: "系統發生錯誤，請稍後重試" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, message: "伺服器發生錯誤" });
  }
});

router.post("/", async (req, res) => {
  const { saleInvoice, saleDateTime, orderTime, completeTime, forHere, count, total, payment, status, details } =
    req.body;
  const data = {
    saleInvoice,
    saleDateTime,
    orderTime,
    completeTime,
    forHere,
    count,
    total,
    payment,
    status,
    details,
  };

  let { error } = validation.salesValidation(data);

  if (error) {
    return res.status(403).send({ success: false, message: error.details[0].message });
  }

  try {
    const [records] = await saleorders.findOne(saleInvoice);
    if (records.length > 0) return res.status(403).send({ success: false, message: "您輸入的訂單編號已存在" });

    let order_data = { saleInvoice, saleDateTime, orderTime, completeTime, forHere, count, total, payment, status };
    let details_dataSet = details.map((detail) => {
      return {
        saleInvoice,
        itemNo: detail.itemNo,
        productNo: detail.productNo,
        quantity: detail.quantity,
        unitPrice: detail.unitPrice,
        remarks: detail.remarks,
      };
    });

    const [order_records, order_field] = await saleorders.insertOne(order_data);
    const [details_records, details_field] = await saledetails.insertMany(details_dataSet);
    update(tableName);
    res.send({ success: true, data: records });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "伺服器發生錯誤" });
  }
});

module.exports = router;
