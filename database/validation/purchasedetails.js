const Joi = require("joi");
const errorHandler = require("./config").errorHandler;

const purchasedetailsValidation = (data) => {
  const schema = Joi.object({
    purchaseInvoice: Joi.string().min(1).max(16).required().label("進貨編號").error(errorHandler),
    genericgoodNo: Joi.string().min(1).max(16).required().label("原物料").error(errorHandler),
    quantity: Joi.number().min(0).required().label("數量").error(errorHandler),
    unitPrice: Joi.number().min(0).required().label("單價").error(errorHandler),
  });

  return schema.validate(data);
};

module.exports = purchasedetailsValidation;


