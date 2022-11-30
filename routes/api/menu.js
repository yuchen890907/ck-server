const dbConnection = require("../../database/databaseConnection");
const { update } = require("../../service/webSocket");
const router = require("express").Router();

const urlParser = (url) => {
  if (url) {
    const host = `${process.env.HOST || `http://localhost${process.env.PORT && `:${process.env.PORT}`}`}`;
    return url.replace("http://localhost", host);
  }
};

router.get("/", async (req, res) => {
  try {
    const [menu_records, menu_field] = await dbConnection.query(
      `SELECT c.classNo, c.className, p.productNo, p.productName, p.unitPrice, p.img, pc.item 
          FROM productclasses AS c, products AS p LEFT JOIN productcustom AS pc ON p.productNo = pc.productNo  
          WHERE c.classNo = p.classNo 
          ORDER BY c.classNo ASC`
    );

    const [customized_records, customized_field] = await dbConnection.query(
      `SELECT * FROM customization AS c NATURAL JOIN customclasses AS cc WHERE c.item = c.item AND c.content = c.content;`
    );

    menu_records.forEach((record, i) => (menu_records[i].img = urlParser(record.img)));

    let menu = menu_records.reduce((groups, item) => {
      const group = groups[item.classNo] || {
        classNo: item.classNo,
        className: item.className,
        products: {},
      };
      const product = group.products[item.productNo] || {
        productNo: item.productNo,
        productName: item.productName,
        unitPrice: item.unitPrice,
        img: item.img,
        items: [],
      };
      if (item.item) product.items.push(item.item);
      group.products[item.productNo] = product;
      groups[item.classNo] = group;
      return groups;
    }, {});

    let customized = customized_records.reduce((groups, item) => {
      const group = groups[item.item] || { itemName: item.item, type: item.type, contents: [] };
      group.contents.push(item);
      groups[item.item] = group;
      return groups;
    }, {});

    const data = { menu, customized };
    res.send({ success: true, data });
  } catch (error) {
    res.status(500).send({ success: false, message: "伺服器發生錯誤" });
  }
});

module.exports = router;
