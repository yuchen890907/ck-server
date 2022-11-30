const Joi = require("joi");
const errorHandler = require("./config").errorHandler;

const customclassesValidation = (data) => {
  const schema = Joi.object({
    item: Joi.string().min(1).max(16).required().label("客製化項目").error(errorHandler),
    type: Joi.string().min(1).max(16).required().label("類型").error(errorHandler),
  });

  return schema.validate(data);
};

module.exports = customclassesValidation;
