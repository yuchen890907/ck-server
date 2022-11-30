const permissionMiddleware = require("../../config/middleware");
const dbConnection = require("../../database/databaseConnection");

const router = require("express").Router();

const labels_month = ["", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];

const labels_season = ["", "(Q1)", "(Q2)", "(Q3)", "(Q4)"];

const colors = [
  "rgba(198, 0, 245, 1)",
  "rgba(234, 0, 215, 1)",
  "rgba(255, 0, 184, 1)",
  "rgba(255, 0, 154, 1)",
  "rgba(255, 0, 126, 1)",
  "rgba(255, 0, 100, 1)",
  "rgba(255, 49, 77, 1)",
  "rgba(255, 82, 56, 1)",
  "rgba(255, 106, 37, 1)",
  "rgba(242, 126, 19, 1)",
  "rgba(240, 139, 0, 1)",
  "rgba(237, 153, 0, 1)",
  "rgba(232, 166, 0, 1)",
  "rgba(225, 179, 0, 1)",
  "rgba(216, 192, 0, 1)",
  "rgba(205, 205, 0, 1)",
  "rgba(193, 218, 0, 1)",
  "rgba(177, 230, 0, 1)",
  "rgba(159, 242, 31, 1)",
  "rgba(111, 243, 83, 1)",
  "rgba(42, 241, 121, 1)",
  "rgba(0, 239, 154, 1)",
  "rgba(0, 234, 183, 1)",
  "rgba(0, 229, 207, 1)",
  "rgba(0, 223, 226, 1)",
  "rgba(0, 215, 239, 1)",
  "rgba(0, 207, 245, 1)",
  "rgba(0, 198, 245, 1)",
  "rgba(0, 209, 243, 1)",
  "rgba(0, 218, 233, 1)",
  "rgba(0, 227, 217, 1)",
  "rgba(0, 234, 195, 1)",
  "rgba(33, 239, 168, 1)",
  "rgba(106, 243, 138, 1)",
  "rgba(155, 245, 108, 1)",
  "rgba(200, 245, 77, 1)",
  "rgba(245, 241, 50, 1)",
];
const bg_colors = [
  "rgba(198, 0, 245, 0.5)",
  "rgba(234, 0, 215, 0.5)",
  "rgba(255, 0, 184, 0.5)",
  "rgba(255, 0, 154, 0.5)",
  "rgba(255, 0, 126, 0.5)",
  "rgba(255, 0, 100, 0.5)",
  "rgba(255, 49, 77, 0.5)",
  "rgba(255, 82, 56, 0.5)",
  "rgba(255, 106, 37, 0.5)",
  "rgba(242, 126, 19, 0.5)",
  "rgba(240, 139, 0, 0.5)",
  "rgba(237, 153, 0, 0.5)",
  "rgba(232, 166, 0, 0.5)",
  "rgba(225, 179, 0, 0.5)",
  "rgba(216, 192, 0, 0.5)",
  "rgba(205, 205, 0, 0.5)",
  "rgba(193, 218, 0, 0.5)",
  "rgba(177, 230, 0, 0.5)",
  "rgba(159, 242, 31, 0.5)",
  "rgba(111, 243, 83, 0.5)",
  "rgba(42, 241, 121, 0.5)",
  "rgba(0, 239, 154, 0.5)",
  "rgba(0, 234, 183, 0.5)",
  "rgba(0, 229, 207, 0.5)",
  "rgba(0, 223, 226, 0.5)",
  "rgba(0, 215, 239, 0.5)",
  "rgba(0, 207, 245, 0.5)",
  "rgba(0, 198, 245, 0.5)",
  "rgba(0, 209, 243, 0.5)",
  "rgba(0, 218, 233, 0.5)",
  "rgba(0, 227, 217, 0.5)",
  "rgba(0, 234, 195, 0.5)",
  "rgba(33, 239, 168, 0.5)",
  "rgba(106, 243, 138, 0.5)",
  "rgba(155, 245, 108, 0.5)",
  "rgba(200, 245, 77, 0.5)",
  "rgba(245, 241, 50, 0.5)",
];
router.use(permissionMiddleware);
router.get("/", async (req, res) => {
  try {
    //-- 月/季/年 營收紀錄 SQL --//
    const [yearRevenue_records] = await dbConnection.query(
      `SELECT * FROM (SELECT YEAR(saleDateTime) as year, SUM(total) as total FROM saleorders GROUP BY year ORDER BY year DESC LIMIT 5) AS t1 ORDER BY year;`
    );
    const [seasonRevenue_records] = await dbConnection.query(
      `SELECT * FROM (SELECT YEAR(saleDateTime) as year, CEILING(MONTH(saleDateTime)/3) as season, SUM(total) as total FROM saleorders GROUP BY year, season ORDER BY year DESC, season DESC LIMIT 4) AS t1 ORDER BY year, season;`
    );
    const [monthRevenue_records] = await dbConnection.query(
      `SELECT * FROM ( SELECT YEAR(saleDateTime) as year, MONTH(saleDateTime) as month, SUM(total) as total FROM saleorders GROUP BY year, month ORDER BY year DESC, month DESC LIMIT 12) AS t1 ORDER BY year, month;`
    );

    //-- 月/季/年 來客人數紀錄 SQL --//
    const [yearCustomCount_records] = await dbConnection.query(
      `SELECT * FROM (SELECT YEAR(saleDateTime) as year, SUM(count) as count FROM saleorders GROUP BY year ORDER BY year DESC LIMIT 5) AS t1 ORDER BY year;`
    );
    const [seasonCustomCount_records] = await dbConnection.query(
      `SELECT * FROM (SELECT YEAR(saleDateTime) as year, CEILING(MONTH(saleDateTime)/3) as season, SUM(count) as count FROM saleorders GROUP BY year, season ORDER BY year DESC, season DESC LIMIT 4) AS t1 ORDER BY year, season;`
    );
    const [monthCustomCount_records] = await dbConnection.query(
      `SELECT * FROM ( SELECT YEAR(saleDateTime) as year, MONTH(saleDateTime) as month, SUM(count) as count FROM saleorders GROUP BY year, month ORDER BY year DESC, month DESC LIMIT 12) AS t1 ORDER BY year, month;`
    );

    //-- 月/季/年 外帶/內用紀錄 SQL --//
    const [yearForHere_records] = await dbConnection.query(
      `SELECT * FROM (SELECT YEAR(saleDateTime) as year, SUM(forHere = '內用') as here, SUM(forHere = '外帶') as takeout FROM saleorders GROUP BY year ORDER BY year DESC LIMIT 5) AS t1 ORDER BY year;`
    );
    const [seasonForHere_records] = await dbConnection.query(
      `SELECT * FROM (SELECT YEAR(saleDateTime) as year, CEILING(MONTH(saleDateTime)/3) as season, SUM(forHere = '內用') as here, SUM(forHere = '外帶') as takeout FROM saleorders GROUP BY year, season ORDER BY year DESC, season DESC LIMIT 4) AS t1 ORDER BY year, season;`
    );
    const [monthForHere_records] = await dbConnection.query(
      `SELECT * FROM ( SELECT YEAR(saleDateTime) as year, MONTH(saleDateTime) as month, SUM(forHere = '內用') as here, SUM(forHere = '外帶') as takeout FROM saleorders GROUP BY year, month ORDER BY year DESC, month DESC LIMIT 12) AS t1 ORDER BY year, month;`
    );

    let monthRevenueData = {
      labels: monthRevenue_records.map((record) => record.year + "-" + labels_month[record.month]),
      datasets: [
        {
          label: "營收",
          data: monthRevenue_records.map((record) => record.total),
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
      ],
    };

    let seasonRevenueData = {
      labels: seasonRevenue_records.map((record) => record.year + " " + labels_season[record.season]),
      datasets: [
        {
          label: "營收",
          data: seasonRevenue_records.map((record) => record.total),
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
      ],
    };

    let yearRevenueData = {
      labels: yearRevenue_records.map((record) => [record.year]),
      datasets: [
        {
          label: "營收",
          data: yearRevenue_records.map((record) => record.total),
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
      ],
    };

    let monthCustomCountData = {
      labels: monthCustomCount_records.map((record) => record.year + "-" + labels_month[record.month]),
      datasets: [
        {
          label: "來客數",
          data: monthCustomCount_records.map((record) => record.count),
          borderColor: "rgb(54, 162, 235)",
          backgroundColor: "rgba(54, 162, 235, 0.2)",
        },
      ],
    };

    let seasonCustomCountData = {
      labels: seasonCustomCount_records.map((record) => record.year + " " + labels_season[record.season]),
      datasets: [
        {
          label: "來客數",
          data: seasonCustomCount_records.map((record) => record.count),
          borderColor: "rgb(54, 162, 235)",
          backgroundColor: "rgba(54, 162, 235, 0.2)",
        },
      ],
    };

    let yearCustomCountData = {
      labels: yearCustomCount_records.map((record) => [record.year]),
      datasets: [
        {
          label: "來客數",
          data: yearCustomCount_records.map((record) => record.count),
          borderColor: "rgb(54, 162, 235)",
          backgroundColor: "rgba(54, 162, 235, 0.2)",
        },
      ],
    };

    let monthForHereData = {
      labels: monthForHere_records.map((record) => record.year + "-" + labels_month[record.month]),
      datasets: [
        {
          type: "line",
          label: "內用",
          data: monthForHere_records.map((record) => record.here),
          backgroundColor: "rgba(53, 162, 235, 0.5)",
          borderColor: "rgba(53, 162, 235, 1)",
          yAxisID: "y",
        },
        {
          type: "line",
          label: "外帶",
          data: monthForHere_records.map((record) => record.takeout),
          backgroundColor: "rgba(215, 99, 132, 0.5)",
          borderColor: "rgba(215, 99, 132, 1)",
          yAxisID: "y1",
        },
      ],
    };

    let seasonForHereData = {
      labels: seasonForHere_records.map((record) => record.year + " " + labels_season[record.season]),
      datasets: [
        {
          type: "line",
          label: "內用",
          data: seasonForHere_records.map((record) => record.here),
          backgroundColor: "rgba(53, 162, 235, 0.5)",
          borderColor: "rgba(53, 162, 235, 1)",
          yAxisID: "y",
        },
        {
          type: "line",
          label: "外帶",
          data: seasonForHere_records.map((record) => record.takeout),
          backgroundColor: "rgba(215, 99, 132, 0.5)",
          borderColor: "rgba(215, 99, 132, 1)",
          yAxisID: "y1",
        },
      ],
    };

    let yearForHereData = {
      labels: yearForHere_records.map((record) => [record.year]),
      datasets: [
        {
          type: "line",
          label: "內用",
          data: yearForHere_records.map((record) => record.here),
          backgroundColor: "rgba(53, 162, 235, 0.5)",
          borderColor: "rgba(53, 162, 235, 1)",
          yAxisID: "y",
        },
        {
          type: "line",
          label: "外帶",
          data: yearForHere_records.map((record) => record.takeout),
          backgroundColor: "rgba(215, 99, 132, 0.5)",
          borderColor: "rgba(215, 99, 132, 1)",
          yAxisID: "y1",
        },
      ],
    };

    let data = {
      monthRevenueData,
      seasonRevenueData,
      yearRevenueData,
      monthCustomCountData,
      seasonCustomCountData,
      yearCustomCountData,
      monthForHereData,
      seasonForHereData,
      yearForHereData,
    };

    res.send({ success: true, data });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "伺服器發生錯誤" });
  }
});

router.get("/date", async (req, res) => {
  const { start, end } = req.query;

  if (!start || !end) return res.status(403).send({ success: false, message: "資料輸入錯誤" });

  try {
    //-- 營收紀錄查詢 SQL --//
    const [earning_records] = await dbConnection.query(
      `SELECT SUM(total) AS total FROM saleorders WHERE saleDateTime BETWEEN "${start}" AND "${end}";`
    );
    const [customCount_records] = await dbConnection.query(
      `SELECT SUM(count) AS count FROM saleorders WHERE saleDateTime BETWEEN "${start}" AND "${end}";`
    );
    const [seatTotal_records] = await dbConnection.query(`SELECT SUM(capacity) AS capacity FROM seats;`);

    const [here_records] = await dbConnection.query(
      `SELECT SUM(forHere = '外帶') AS here FROM saleorders WHERE saleDateTime BETWEEN "${start}" AND "${end}";`
    );
    const [out_records] = await dbConnection.query(
      `SELECT SUM(forHere = '內用') AS takeout FROM saleorders WHERE saleDateTime BETWEEN "${start}" AND "${end}";`
    );

    const [hotRank_records] = await dbConnection.query(
      `SELECT p.productName, SUM(s.quantity) AS quantity, SUM(s.quantity*s.unitPrice) AS total FROM saledetails AS s, products AS p 
       WHERE s.productNo = P.productNo AND saleInvoice IN (SELECT saleInvoice FROM saleorders WHERE saleDateTime BETWEEN "${start}" AND "${end}") 
       GROUP BY p.productName 
       ORDER BY total DESC, quantity DESC
       limit 10;`
    );

    let cards = [
      { title: "營收金額", value: `${earning_records[0].total || 0}/元` },
      { title: "來客數", value: `${customCount_records[0].count || 0}/人` },
      {
        title: "翻桌率",
        value: `${Math.floor((customCount_records[0].count / seatTotal_records[0].capacity) * 10) / 10 || 0}/次`,
      },
      {
        title: "客單價",
        value: `${Math.floor((earning_records[0].total / customCount_records[0].count) * 10) / 10 || 0}/元`,
      },
    ];

    let doughnutData = {
      labels: ["內用", "外帶"],
      datasets: [
        {
          label: "",
          data: [here_records[0].here || 0, out_records[0].takeout || 0],
          backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)"],
          borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
          borderWidth: 1,
        },
      ],
    };

    let hotRank = {
      data: hotRank_records,
      labels: ["productName", "total", "quantity"],
      schemas: ["商品名稱", "銷售額", "銷售量"],
    };

    let hotRankTotalChart = {
      labels: hotRank_records.map((record) => record.productName),
      datasets: [
        {
          type: "bar",
          label: "銷售額",
          data: hotRank_records.map((record) => record.total),
          backgroundColor: "rgba(53, 162, 235, 0.5)",
          borderColor: "rgba(53, 162, 235, 1)",
        },
      ],
    };

    let hotRankQuantityChart = {
      labels: hotRank_records.map((record) => record.productName),
      datasets: [
        {
          type: "bar",
          label: "銷售量",
          data: hotRank_records.map((record) => record.quantity),
          backgroundColor: "rgba(215, 99, 132, 0.5)",
          borderColor: "rgba(215, 99, 132, 1)",
        },
      ],
    };

    let hotRankChart = {
      labels: hotRank_records.map((record) => record.productName),
      datasets: [
        {
          type: "line",
          label: "銷售額",
          data: hotRank_records.map((record) => record.total),
          backgroundColor: "rgba(53, 162, 235, 0.5)",
          borderColor: "rgba(53, 162, 235, 1)",
          yAxisID: "y",
        },
        {
          type: "bar",
          label: "銷售量",
          data: hotRank_records.map((record) => record.quantity),
          backgroundColor: "rgba(215, 99, 132, 0.5)",
          borderColor: "rgba(215, 99, 132, 1)",
          yAxisID: "y1",
        },
      ],
    };

    const data = { cards, doughnutData, hotRankTotalChart, hotRankQuantityChart, hotRank, hotRankChart };

    res.send({ success: true, data });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "伺服器發生錯誤" });
  }
});

router.get("/sale", async (req, res) => {
  const { start, end, type, id } = req.query;

  if (!start || !end || !type || !id) return res.status(403).send({ success: false, message: "資料輸入錯誤" });

  try {
    //-- 營收紀錄查詢 SQL --//

    let sql;
    let data = {};
    const tzoffset = new Date().getTimezoneOffset() * 60000;

    if (type === "product") {
      const [customCount_records] = await dbConnection.query(
        `SELECT CAST(saleDateTime AS DATE) AS saleDateTime, SUM(count) AS count FROM saleorders
         WHERE saleDateTime BETWEEN "${start}" AND "${end}" AND saleInvoice IN(SELECT saleInvoice FROM saledetails WHERE productNo = "${id}")
         GROUP BY saleDateTime
         ORDER BY saleDateTime;`
      );
      sql = `SELECT CAST(o.saleDateTime AS DATE) AS saleDateTime, p.productName, sum(d.quantity) AS quantity, sum(d.quantity*d.unitPrice) AS total 
             FROM saleorders AS o, saledetails AS d, products AS p 
             WHERE d.productNo = p.productNo AND o.saleInvoice = d.saleInvoice AND p.productNo = "${id}" AND saleDateTime BETWEEN "${start}" AND "${end}" 
             GROUP BY saleDateTime 
             ORDER BY saleDateTime, total DESC, quantity DESC;`;

      const [sale_records] = await dbConnection.query(sql);

      let saleQuantityChart = {
        labels: sale_records.map((record) =>
          new Date(record.saleDateTime - tzoffset).toISOString().slice(0, 10).replace("T", " ")
        ),
        datasets: [
          {
            type: "line",
            label: "來客數",
            data: customCount_records.map((record) => record.count),
            backgroundColor: "rgba(53, 162, 235, 0.5)",
            borderColor: "rgba(53, 162, 235, 1)",
            yAxisID: "y",
          },
          {
            type: "bar",
            label: "銷售量",
            data: sale_records.map((record) => record.quantity),
            backgroundColor: "rgba(215, 99, 132, 0.5)",
            borderColor: "rgba(215, 99, 132, 1)",
            yAxisID: "y1",
          },
        ],
      };

      let saleTotalChart = {
        labels: sale_records.map((record) =>
          new Date(record.saleDateTime - tzoffset).toISOString().slice(0, 10).replace("T", " ")
        ),
        datasets: [
          {
            type: "line",
            label: "來客數",
            data: customCount_records.map((record) => record.count),
            backgroundColor: "rgba(53, 162, 235, 0.5)",
            borderColor: "rgba(53, 162, 235, 1)",
            yAxisID: "y",
          },
          {
            type: "bar",
            label: "銷售額",
            data: sale_records.map((record) => record.total),
            backgroundColor: "rgba(215, 99, 132, 0.5)",
            borderColor: "rgba(215, 99, 132, 1)",
            yAxisID: "y1",
          },
        ],
      };

      data.saleQuantityChart = saleQuantityChart;
      data.saleTotalChart = saleTotalChart;
    } else if (type === "class") {
      const [customCount_records] = await dbConnection.query(
        `SELECT saleDateTime, SUM(count) AS count FROM saleorders
         WHERE saleDateTime BETWEEN "${start}" AND "${end}"
         GROUP BY saleDateTime
         ORDER BY saleDateTime;`
      );
      sql = `SELECT o.saleDateTime AS saleDateTime, p.productName AS productName, sum(d.quantity) AS quantity, sum(d.quantity*d.unitPrice) AS total 
      FROM saleorders AS o, saledetails AS d, products AS p, productclasses AS c 
      WHERE o.saleInvoice = d.saleInvoice AND d.productNo = p.productNo AND p.classNo = c.classNo 
      AND c.classNo = "${id}" AND saleDateTime BETWEEN "${start}" AND "${end}" 
      GROUP BY saleDateTime, productName 
      UNION 
      SELECT o.saleDateTime AS saleDateTime, p.productName AS productName, 0, 0 
      FROM saleorders AS o, products AS p, productclasses AS c 
      WHERE p.classNo = c.classNo 
      AND c.classNo = "${id}" AND saleDateTime BETWEEN "${start}" AND "${end}" 
      AND (saleDateTime, productNo) NOT IN (SELECT o.saleDateTime, d.productNo FROM saleorders AS o, saledetails AS d, products AS p 
        WHERE o.saleInvoice = d.saleInvoice AND d.productNo = p.productNo) 
        GROUP BY saleDateTime, productName 
        ORDER BY saleDateTime, productName;`;

      const [count_records] = await dbConnection.query(
        `SELECT COUNT(*) AS count FROM products WHERE classNo = "${id}";`
      );
      const [sale_records] = await dbConnection.query(sql);

      //-- 無資料 --//
      if (sale_records.length === 0) return res.status(403).send({ success: false, message: "查無資料" });

      //-- chart 變數 --//
      let labels = [];
      let total_datasets = [
        {
          type: "line",
          label: "來客數",
          data: customCount_records.map((record) => record.count),
          backgroundColor: "rgba(53, 162, 235, 0.5)",
          borderColor: "rgba(53, 162, 235, 1)",
          yAxisID: "y",
        },
      ];
      let quantity_datasets = [...total_datasets];
      const count = count_records[0].count;

      //-- chart labels set --//
      for (let i = 0; i < sale_records.length / count; i++) {
        labels.push(
          new Date(sale_records[i * count].saleDateTime - tzoffset).toISOString().slice(0, 10).replace("T", " ")
        );
      }

      //-- chart data set --//
      for (let i = 0; i < count; i++) {
        let total_data = [];
        let quantity_data = [];
        for (let j = 0; j < sale_records.length / count; j++) {
          total_data.push(sale_records[j * count + i].total);
          quantity_data.push(sale_records[j * count + i].quantity);
        }
        const color_index = Math.floor((bg_colors.length / count) * i);
        total_datasets.push({
          type: "bar",
          label: sale_records[i].productName,
          data: total_data,
          backgroundColor: bg_colors[color_index],
          borderColor: colors[color_index],
          yAxisID: "y1",
        });
        quantity_datasets.push({
          type: "bar",
          label: sale_records[i].productName,
          data: quantity_data,
          backgroundColor: bg_colors[color_index],
          borderColor: colors[color_index],
          yAxisID: "y1",
        });
      }

      let saleQuantityChart = { labels, datasets: quantity_datasets };
      let saleTotalChart = { labels, datasets: total_datasets };
      data.saleQuantityChart = saleQuantityChart;
      data.saleTotalChart = saleTotalChart;
    }
    res.send({ success: true, data });
  } catch (error) {
    // console.log(error);
    res.status(500).send({ success: false, message: "伺服器發生錯誤" });
  }
});
module.exports = router;
