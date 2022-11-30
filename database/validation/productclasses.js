const Joi = require("joi");
const errorHandler = require("./config").errorHandler;

const productclassesValidation = (data) => {
  const schema = Joi.object({
    classNo: Joi.string().min(1).max(16).required().label("商品類別編號").error(errorHandler),
    className: Joi.string().min(1).max(16).required().label("商品類別名稱").error(errorHandler),
  });

  return schema.validate(data);
};

module.exports = productclassesValidation;
