const Joi = require("joi");
const errorHandler = require("./config").errorHandler;

const genericgoodsValidation = (data) => {
  const schema = Joi.object({
    genericgoodNo: Joi.string().min(1).max(16).required().label("原物料編號").error(errorHandler),
    genericgoodName: Joi.string().min(1).max(64).required().label("原物料名稱").error(errorHandler),
    unit: Joi.string().min(1).max(10).required().label("單位").error(errorHandler),
    inventory: Joi.number().min(0).required().label("庫存量").error(errorHandler),
    sale_Inventory: Joi.number().min(0).required().label("安全庫存量").error(errorHandler),
  });
  
  return schema.validate(data);
};

module.exports = genericgoodsValidation;
