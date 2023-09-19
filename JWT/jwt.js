const jwt = require('jsonwebtoken');
const { sign, verify } = jwt;

require('dotenv').config();

const createAccessToken = (id) => {
	const token = sign({ name: id }, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: '15s',
	});
	return token;
};

const createRefreshToken = (id) => {
	const token = sign({ name: id }, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: '7d',
	});
	return token;
};

const verifyAccessToken = (req, res, next) => {
	const authHeader = req.headers.authorization;
	if (authHeader) {
		const token = authHeader.split(' ')[1];
		verify(token, process.env.ACCESS_TOKEN_SECRET, (err) => {
			if (err) {
				return res.status(400).send({ msg: err.message });
			}
			next();
		});
	} else {
		res.status(400).send({ msg: 'You do not have access!' });
	}
};

const verifyRefreshToken = (req, res, next) => {
	const refreshToken = req.cookies['refreshToken'];
	if (refreshToken) {
		verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err) => {
			if (err) {
				return res.status(400).send({ msg: err.message });
			}
			next();
		});
	} else {
		res.status(401).send({ msg: 'You are not authorized!' });
	}
};

module.exports = {
	createAccessToken,
	createRefreshToken,
	verifyAccessToken,
	verifyRefreshToken,
};
