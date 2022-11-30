const Joi = require("joi");
const errorHandler = require("./config").errorHandler;

const guidesValidation = (data) => {
  const schema = Joi.object({
    dataID: Joi.number().min(0).label("dataID").error(errorHandler),
    updateDateTime: Joi.date().required().label("更新時間").error(errorHandler),
    title: Joi.string().min(1).max(32).required().label("標題").error(errorHandler),
    file: Joi.string().uri().min(1).max(255).required().label("檔案").error(errorHandler),
    eAccount: Joi.string().min(3).max(16).required().label("發布者").error(errorHandler),
  });

  return schema.validate(data);
};

module.exports = guidesValidation;
