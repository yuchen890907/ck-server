require("dotenv").config();
const path = require("path");
const express = require("express");
const app = express();
const passport = require("passport");
require("./config/passport")(passport);

//-- middleware --//
app.use(require("cors")()); //google "CORS"
app.use(require("express-fileupload")());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(require("morgan")("dev"));

//-- routes --//
const routes = require("./routes");
const morgan = require("morgan");
app.use("/api", passport.authenticate("jwt", { session: false }), routes.APIRouter);
app.use("/upload", passport.authenticate("jwt", { session: false }), routes.uploadRouter);
app.use("/auth", routes.authRouter);
app.use("/admin", routes.adminAuthRouter);
app.get("/*", (req, res) => res.redirect(process.env.REDIRECT_URL));
// app.get("/*", (req, res) => res.status(404).send({ success: false }));

// // -- http Server --//
// const server = require("http").createServer(app);

// -- https Server --//
const fs = require("fs");
const dbConnection = require("./database/databaseConnection");
const privateKey = fs.readFileSync("./cert/cookassistant.tk.key");
const certificate = fs.readFileSync("./cert/cookassistant.tk.pem");
const credentials = { key: privateKey, cert: certificate };
const server = require("https").createServer(credentials, app);

//-- webSocket --//
const io = require("./service/webSocket").init(server);
io.on("connection", (socket) => {
	console.log("socket connected: ", socket.id);
	socket.on("connected", (data) => {
		console.log("from: ", data);
	});
	socket.on("disconnect", () => {
		console.log("socket disconnected: ", socket.id);
	});
	socket.on("test", (message) => {
		console.log("test message: ", message);
	});
});

server.listen(process.env.PORT || 8000, () => console.log(`Server is running on https://localhost:${process.env.PORT}.`));
