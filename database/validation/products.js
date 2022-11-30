const Joi = require("joi");
const errorHandler = require("./config").errorHandler;

const productsValidation = (data) => {
  const schema = Joi.object({
    productNo: Joi.string().min(1).max(16).required().label("商品編號").error(errorHandler),
    productName: Joi.string().min(1).max(16).required().label("商品名稱").error(errorHandler),
    unitPrice: Joi.number().min(0).required().label("單價").error(errorHandler),
    img: Joi.string().uri().min(1).max(255).label("示意圖").error(errorHandler),
    classNo: Joi.string().min(1).max(16).required().label("商品類別").error(errorHandler),
  });

  return schema.validate(data);
};

module.exports = productsValidation;
