const jwt = require("jsonwebtoken");

const secret = "roshambotsruleiugyoinlijuygiugiuh";
const expiration = "2h";

module.exports = {
	authMiddleware: async function ({ req }) {
		// allows token to be sent via req.body, req.query, or headers
		let token = req.body.token || req.query.token || req.headers.authorization;

		// We split the token string into an array and return actual token
		if (req.headers.authorization) {
			token = token.split(" ").pop().trim();
		}

		if (!token) {
			return req;
		}

		// if token can be verified, add the decoded user's data to the request so it can be accessed in the resolver
		try {
			const { data } = jwt.verify(token, secret, { maxAge: expiration });
			req.user = data;
		} catch {
			console.log("Invalid token");
		}

		// return the request object so it can be passed to the resolver as `context`
		return req;
	},
	// signToken: function ({ THE PAYLOAD IN HERE }) {
	signToken: function ({ email, username, _id }) {
		const payload = { email, username, _id };
		//using the jwt tool to sign the payload using the secret and how long we want it to last
		//this is the signed token that is given back to the browser
		return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
	},
};
