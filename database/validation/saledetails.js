const Joi = require("joi");
const errorHandler = require("./config").errorHandler;

const saledetailsValidation = (data) => {
  const schema = Joi.object({
    saleInvoice: Joi.string().min(1).max(16).required().label("訂單發票").error(errorHandler),
    itemNo: Joi.number().min(1).max(11).required().label("編號").error(errorHandler),
    productNo: Joi.string().min(1).max(16).required().label("商品").error(errorHandler),
    quantity: Joi.number().min(1).required().label("數量").error(errorHandler),
    unitPrice: Joi.number().min(1).required().label("單價").error(errorHandler),
    remarks: Joi.string().max(255).label("備註").error(errorHandler),
  });
  
  return schema.validate(data);
};

module.exports = saledetailsValidation;
