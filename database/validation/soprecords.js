const Joi = require("joi");
const errorHandler = require("./config").errorHandler;

const soprecordsValidation = (dataSet) => {
  const schema = Joi.array().items(
    Joi.object({
      registerDateTime: Joi.date().required().label("編輯時間").error(errorHandler),
      sopClass: Joi.string().min(2).max(2).required().label("類別").error(errorHandler),
      content: Joi.string().min(1).max(128).required().label("內容").error(errorHandler),
      eAccount: Joi.string().min(3).max(16).required().label("職員").error(errorHandler),
    })
  );

  return schema.validate(dataSet);
};

module.exports = soprecordsValidation;
