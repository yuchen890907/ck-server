const mysql = require("mysql2");
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "gt_cookassistant",
  charset: "utf8",
});
const dbConnection = pool.promise();
module.exports = dbConnection;
