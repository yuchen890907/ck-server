module.exports.errorHandler = (errors) => {
  errors.forEach((err) => {
    switch (err.code) {
      case "required":
        err.message = `請輸入'${err.local.label}'!`;
        break;
      case "any.required":
        err.message = `請輸入'${err.local.label}'!`;
        break;
      case "any.empty":
        err.message = `請輸入'${err.local.label}'!`;
        break;
      case "any.only":
        err.message = `請選擇'${err.local.label}'!`;
        break;
      case "number.base":
        err.message = `'${err.local.label}'僅能輸入數字!`;
        break;
      case "number.min":
        err.message = `'${err.local.label}'需要大於 ${err.local.limit} !`;
        break;
      case "number.max":
        err.message = `'${err.local.label}'需要小於 ${err.local.limit} !`;
        break;
      case "string.base":
        err.message = `'${err.local.label}'僅能輸入字串!`;
        break;
      case "string.min":
        err.message = `'${err.local.label}'的長度需要大於${err.local.limit}個字!`;
        break;
      case "string.max":
        err.message = `'${err.local.label}'的長度需要小於${err.local.limit}個字!`;
        break;
      case "string.empty":
        err.message = `請輸入'${err.local.label}'!`;
        break;
      case "string.valid":
        err.message = `請選擇'${err.local.label}'!`;
        break;
      case "string.email":
        err.message = `請輸入正確的'${err.local.label}'格式!`;
        break;
      case "date.base":
        err.message = `'${err.local.label}'僅能輸入日期或時間!`;
        break;
      case "date.empty":
        err.message = `請輸入'${err.local.label}'!`;
        break;
      case "array.items.empty":
        err.message = `請輸入'${err.local.label}'!`;
        break;
      case "array.min":
        err.message = `'${err.local.label}'至少需有 ${err.local.limit} 筆以上的資料 !`;
        break;
      case "items.empty":
        err.message = `請輸入'${err.local.label}'!`;
        break;
      case "array.empty":
        err.message = `請輸入'${err.local.label}'!`;
        break;
      case "array.required":
        err.message = `請輸入'${err.local.label}'!`;
        break;
      default:
        break;
    }
  });
  return errors;
};
