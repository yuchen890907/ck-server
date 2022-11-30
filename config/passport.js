const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const employees = require("../database/models").employees;
const positions = require("../database/models").positions;

module.exports = (passport) => {
	let opts = {};
	opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
	opts.secretOrKey = process.env.PASSPORT_SECRET;
	passport.use(
		new JwtStrategy(opts, async (tokenObject, done) => {
			try {
				const [records, felid] = await employees.findOne(tokenObject.account);
				const [positions_records] = await positions.findOne(records[0].position);
				const permissions = JSON.parse(positions_records[0].permissions || "{}");
				records[0].permission = permissions;
				if (records[0]) done(null, records[0]);
				else done(null, false);
			} catch (err) {
				done(err, false);
			}
		})
	);
};
