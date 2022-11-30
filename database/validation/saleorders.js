const Joi = require("joi");
const errorHandler = require("./config").errorHandler;

const saleordersValidation = (data) => {
  const schema = Joi.object({
    saleInvoice: Joi.string().min(1).max(16).required().label("訂單發票").error(errorHandler),
    saleDateTime: Joi.date().required().label("訂購日期").error(errorHandler),
    orderTime: Joi.date().required().label("訂購時間").error(errorHandler),
    completeTime: Joi.date().label("完成時間").error(errorHandler),
    forHere: Joi.string().min(2).max(2).required().label("內用/外帶").error(errorHandler),
    count: Joi.number().min(0).required().label("用餐人數").error(errorHandler),
    total: Joi.number().min(0).required().label("總計").error(errorHandler),
    payment: Joi.string().min(1).max(16).required().label("付費方式").error(errorHandler),
    status: Joi.string().min(1).max(11).required().label("訂單狀態").error(errorHandler),
  });
  
  return schema.validate(data);
};

module.exports = saleordersValidation;
