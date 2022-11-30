const Joi = require("joi");
const errorHandler = require("./config").errorHandler;

const productcustomValidation = (data) => {
	const schema = Joi.array().items(
		Joi.object({
			item: Joi.string().min(1).max(16).required().label("客製化項目").error(errorHandler),
			productNo: Joi.string().min(1).max(16).required().label("商品").error(errorHandler),
		})
	);

	return schema.validate(data);
};

module.exports = productcustomValidation;
