const permissionMiddleware = (req, res, next) => {
	const path = req.originalUrl.split("/")[2];
	if (
		(req.method === "GET" && req.user.permission[path].read) ||
		(req.method !== "GET" && req.user.permission[path].write)
	)
		next();
	else res.status(403).send({ success: false, message: "您的權限不足" });
};
module.exports = permissionMiddleware;
