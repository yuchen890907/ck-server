const Joi = require("joi");
const errorHandler = require("./config").errorHandler;

const schedulesValidation = (data) => {
  const schema = Joi.object({
    scheduleNo: Joi.number().min(0).label("流水號").error(errorHandler),
    workDate: Joi.date().required().label("日期").error(errorHandler),
    start: Joi.string().regex(/^([0-9]{2}):([0-9]{2}):([0-9]{2})$/).label("上班時間").error(errorHandler),
    leave: Joi.string().regex(/^([0-9]{2}):([0-9]{2}):([0-9]{2})$/).label("下班時間").error(errorHandler),
    eAccount: Joi.string().min(3).max(16).required().label("職員").error(errorHandler),
    job: Joi.string().min(1).max(32).required().label("工作崗位").error(errorHandler),
    remarks: Joi.string().allow(null).allow('').optional().label("備註").error(errorHandler),
  });

  return schema.validate(data);
};

module.exports = schedulesValidation;
