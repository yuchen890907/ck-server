const Joi = require("joi");
const errorHandler = require("./config").errorHandler;

const purchaseordersValidation = (data) => {
  const schema = Joi.object({
    purchaseInvoice: Joi.string().min(1).max(16).required().label("進貨編號").error(errorHandler),
    purchaseDateTime: Joi.date().required().label("進貨時間").error(errorHandler),
    total: Joi.number().min(0).required().label("總計").error(errorHandler),
    eAccount: Joi.string().min(3).max(16).required().label("職員").error(errorHandler),
    sPhone: Joi.string()
      .min(8)
      .max(13)
      .pattern(/^[0-9]+$/)
      .required().label("供應商").error(errorHandler),
  });

  return schema.validate(data);
};

module.exports = purchaseordersValidation;
