const Joi = require("joi");
const errorHandler = require("./config").errorHandler;

const customizationValidation = (data) => {
  const schema = Joi.object({
    item: Joi.string().min(1).max(16).required().label("項目").error(errorHandler),
    content: Joi.string().min(1).max(16).required().label("內容").error(errorHandler),
    price: Joi.number().min(0).required().label("價格").error(errorHandler),
  });

  return schema.validate(data);
};

module.exports = customizationValidation;
