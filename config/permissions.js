const permissions = {
	guides: { permission: "guides", label: "新進員工指南", type: "table", write: false, read: false },
	sales: { permission: "sales", label: "訂單紀錄", type: "table", write: false, read: false },
	schedules: { permission: "schedules", label: "職員班表", type: "table", write: false, read: false },
	earningrecord: { permission: "earningrecord", label: "營收紀錄", type: "table", write: false, read: false },
	genericgoods: { permission: "genericgoods", label: "庫存檢視", type: "table", write: false, read: false },
	suppliers: { permission: "suppliers", label: "供應商資訊", type: "table", write: false, read: false },
	adminSystem: { permission: "adminSystem", label: "後台管理系統", type: "system", allow: false },
};

module.exports = { permissions };
