const Joi = require("joi");
const errorHandler = require("./config").errorHandler;

const employeesValidation = (data) => {
  const schema = Joi.object({
    account: Joi.string().min(3).max(16).required().label("帳號").error(errorHandler),
    password: Joi.string().min(8).max(64).required().label("密碼").error(errorHandler),
    name: Joi.string().min(2).max(10).required().label("姓名").error(errorHandler),
    sex: Joi.string().valid("男性", "女性").required().label("性別").error(errorHandler),
    phone: Joi.string()
      .min(8)
      .max(13)
      .pattern(/^[0-9]+$/)
      .required().label("電話").error(errorHandler),
    email: Joi.string().email().required().label("Email").error(errorHandler),
    position: Joi.string().min(2).max(10).required().label("職位").error(errorHandler),
    salary: Joi.number().min(0).required().label("薪水").error(errorHandler),
    enrollmentDate: Joi.date().required().label("入職時間").error(errorHandler),
    resignationDate: Joi.date().label("離職時間").error(errorHandler),
  });

  return schema.validate(data);
};

module.exports = employeesValidation;
