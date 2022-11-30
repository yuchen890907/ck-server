const Joi = require("joi");
const errorHandler = require("./config").errorHandler;

const ordersValidation = (data) => {
  const schema = Joi.object({
    saleInvoice: Joi.string().min(1).max(16).required().label("訂單發票").error(errorHandler),
    saleDateTime: Joi.date().required().label("訂購日期").error(errorHandler),
    orderTime: Joi.string().required().regex(/^([0-9]{2}):([0-9]{2}):([0-9]{2})$/).label("成立時間").error(errorHandler),
    completeTime: Joi.string().regex(/^([0-9]{2}):([0-9]{2}):([0-9]{2})$/).label("完成時間").allow(null).error(errorHandler),
    forHere: Joi.string().valid("內用", "外帶").required().label("用餐方式").error(errorHandler),
    count: Joi.number().min(1).required().label("用餐人數").error(errorHandler),
    total: Joi.number().min(0).required().label("總計").error(errorHandler),
    payment: Joi.string().min(1).max(16).required().label("付款方式").error(errorHandler),
    status: Joi.string().min(1).max(11).required().label("訂單狀態").error(errorHandler),
  });
  
  return schema.validate(data);
};
const orderdetailsValidation = (data) => {
  const schema = Joi.array()
    .items(
      Joi.object({
        saleInvoice: Joi.string().min(1).max(16).required().label("訂單發票").error(errorHandler),
        itemNo: Joi.number().min(1).required().label("項目").error(errorHandler),
        productNo: Joi.string().min(1).max(16).required().label("商品").error(errorHandler),
        quantity: Joi.number().min(1).required().label("數量").error(errorHandler),
        unitPrice: Joi.number().min(1).required().label("單價").error(errorHandler),
        remarks: Joi.string().min(0).max(255).label("備註").error(errorHandler),
      })
    ).min(1).required().label("進貨明細").error(errorHandler);

  return schema.validate(data);
};

module.exports = { ordersValidation, orderdetailsValidation };
