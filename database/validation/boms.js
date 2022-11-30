const Joi = require("joi");
const errorHandler = require("./config").errorHandler;

const bomsValidation = (data) => {
  const schema = Joi.object({
    productNo: Joi.string().min(1).max(16).required().label("商品品項").error(errorHandler),
    genericgoodNo: Joi.string().min(1).max(16).required().label("原物料品項").error(errorHandler),
    quantity: Joi.number().min(0).required().label("數量").error(errorHandler),
    unit: Joi.string().min(1).max(11).required().label("單位").error(errorHandler),
  });

  return schema.validate(data);
};

module.exports = bomsValidation;
