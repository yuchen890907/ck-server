const Joi = require("joi");
const errorHandler = require("./config").errorHandler;

const punchrecordsValidation = (data) => {
  const schema = Joi.object({
    punchDateTime: Joi.date().required().label("打卡時間").error(errorHandler),
    eAccount: Joi.string().min(3).max(16).required().label("職員").error(errorHandler),
    GPS: Joi.string().uri().min(1).max(255).label("GPS位置").error(errorHandler),
    status: Joi.string().min(2).max(2).required().label("狀態").error(errorHandler),
    remarks: Joi.string().min(0).label("備註").error(errorHandler),
  });

  return schema.validate(data);
};

module.exports = punchrecordsValidation;
