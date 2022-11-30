const Joi = require("joi");
const errorHandler = require("./config").errorHandler;

const suppliersValidation = (data) => {
  const schema = Joi.object({
    supplierNo: Joi.string().min(1).max(16).required().label("供應商編號").error(errorHandler),
    supplierName: Joi.string().min(2).max(10).required().label("負責人姓名").error(errorHandler),
    headName: Joi.string().min(2).max(64).required().label("公司名稱").error(errorHandler),
    phone: Joi.string()
    .min(8)
    .max(13)
    .pattern(/^[0-9]+$/)
    .required().label("聯絡電話").error(errorHandler),
    postalCode: Joi.string().min(3).max(16).required().label("郵遞區號").error(errorHandler),
    address: Joi.string().min(3).max(128).required().label("地址").error(errorHandler),
  });

  return schema.validate(data);
};

module.exports = suppliersValidation;
