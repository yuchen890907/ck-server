const employees = require("../database/models").employees;
const positions = require("../database/models").positions;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const testPermissions = require("../config/permissions").testPermissions;
const router = require("express").Router();

router.post("/login/:system", async (req, res) => {
	const { system } = req.params;

	try {
		const { account, password } = req.body;
		const [records, field] = await employees.findOne(account);
		if (records.length > 0) {
			//登入檢查
			const isMatch = await bcrypt.compare(password, records[0].password);
			if (isMatch) {
				//權限過濾
				const [positions_records] = await positions.findOne(records[0].position);
				const permissions = JSON.parse(positions_records[0].permissions || "{}");
				//console.log(permissions);
				if (system && system === "admin") {
					if (permissions?.adminSystem?.allow !== true)
						return res.status(401).send({ success: false, message: "權限不足" });
				}
				const tokenObject = {
					account: records[0].account,
					name: records[0].name,
					position: records[0].position,
					permission: permissions,
				};
				// const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET, {expiresIn: 10});
				const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET, { expiresIn: "12h" });
				return res.send({ success: true, user: tokenObject, token: "JWT " + token });
			}
		}
		res.status(401).send({ success: false, message: "使用者帳號或密碼錯誤" });
	} catch (e) {
		res.status(500).send({ success: false, message: "伺服器發生錯誤" });
	}
});

module.exports = router;
