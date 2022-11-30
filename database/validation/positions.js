const Joi = require("joi");
const errorHandler = require("./config").errorHandler;

const positionsValidation = (data) => {
  const schema = Joi.object({
    position: Joi.string().min(1).max(20).required().label("職位").error(errorHandler),
    level: Joi.number().required().label("權限").error(errorHandler),
    permissions: Joi.string().error(errorHandler),
  });

  return schema.validate(data);
};

module.exports = positionsValidation;
