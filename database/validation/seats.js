const Joi = require("joi");
const errorHandler = require("./config").errorHandler;

const sopformValidation = (data) => {
  const schema = Joi.object({
    tableNo: Joi.string().min(1).max(3).required().label("桌號").error(errorHandler),
    capacity: Joi.number().min(0).required().label("容納人數").error(errorHandler),
  });

  return schema.validate(data);
};

module.exports = sopformValidation;
