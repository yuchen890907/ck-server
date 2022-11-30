const Joi = require("joi");
const errorHandler = require("./config").errorHandler;

const sopformValidation = (data) => {
  const schema = Joi.object({
    sopClass: Joi.string().min(2).max(2).required().label("類別").error(errorHandler),
    content: Joi.string().min(1).max(128).required().label("內容").error(errorHandler),
  });

  return schema.validate(data);
};

module.exports = sopformValidation;
