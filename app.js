const express = require('express');
const MongoDb = require('./db');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();
const jwt = require('./JWT/jwt');

require('dotenv').config();

const port = process.env.PORT || 3300;
const { connect, database } = MongoDb;
const {createAccessToken, createRefreshToken, verifyAccessToken, verifyRefreshToken } = jwt;

app.use(cookieParser());
app.use(
	cors({
		credentials: true,
		origin: true,
	})
);
app.use(express.json());

connect((err) => {
	if (err) console.log(err);
	let db = database();
	let usersDB = db.collection('users');

	app.get('/', (req, res) => {
		res.send('Success');
	});

	app.post('/login', (req, res) => {
		let id = req.body.username;
		let pass = req.body.password;

		usersDB.findOne({ _id: id }).then((user) => {
			if (!user)
				res
					.status(400)
					.json({ msg: 'User with that username does not exist!' });
			if (user && user.password === pass) {
				const accessToken = createAccessToken(id);
				const refreshToken = createRefreshToken(id);
				res.cookie('refreshToken', refreshToken)
				res.status(200).json({ msg: 'Login Successful', token: accessToken, data: user });
			} else if (user && user.password !== pass) {
				res.status(400).json({ msg: 'Incorrect Password!' });
			}
		});
	});

	app.post('/logout', (req, res) => {
		res
			.clearCookie('refreshToken')
			.status(200)
			.json({ msg: 'Successfully Logged Out' });
	});

	app.get('/token', verifyRefreshToken, (req, res) => {
		let newToken = createAccessToken(req.body.username)
		res.status(200).send({ token: newToken })
	})

	app.post('/signup', (req, res) => {
		let id = req.body.username;

		usersDB.findOne({ _id: id }).then((user) => {
			if (user) {
				res.status(400).json({ msg: 'User with that name already exists!' });
			} else {
				const user = {
					displayName: id,
					_id: id,
					username: id,
					firstName: req.body.firstName,
					lastName: req.body.lastName,
					password: req.body.password,
					email: req.body.email,
					dob: req.body.dob,
					phoneNumber: req.body.phoneNumber,
					movieList: [],
				};
				usersDB.insertOne(user).then(() => {
					res.status(200).json({ msg: 'Account successfully created!' });
				});
			}
		});
	});

	app.post('/account/info', verifyAccessToken, (req, res) => {
		let id = req.body._id;
		usersDB.findOne({ _id: id }).then((user) => {
			res
				.status(200)
				.send({ msg: `Welcome back ${user.displayName}`, data: user });
		});
	});

	app.put('/account/update', verifyAccessToken, (req, res) => {
		const id = req.body.username;
		// field to update
		const updateField = req.body.updateField;
		const newField = req.body.newField;
		const password = req.body.password;

		usersDB.findOne({ _id: id }).then((user) => {
			if (user.password === password) {
				usersDB
					.updateOne({ _id: id }, { $set: { [updateField]: newField } })
					.then(() => {
						res.status(200).send({
							msg: 'Account successfully updated, refresh to see the changes!',
							data: user,
						});
					});
			} else {
				res.status(400).send({ msg: 'Incorrect password!' });
			}
		});
	});

	app.put('/account/preferences', verifyAccessToken, (req, res) => {
		const id = req.body.username;
		const media = req.body.type;
		const list = req.body.list;

		usersDB.updateOne({ _id: id }, { $set: { [media]: list } }).then((data) => {
			res
				.status(200)
				.send({ msg: 'User Preferences successfully updated', list: list });
		});
	});

	app.put('/account/user-movies', verifyAccessToken, (req, res) => {
		const id = req.body.username;
		const list = req.body.list;
		usersDB.updateOne({ _id: id }, { $set: { movieList: list } }).then((data) => {
			res
				.status(200)
				.send({ msg: 'User list successfully updated', list: list });
		});
	});

	app.post('/account/delete', verifyAccessToken, (req, res) => {
		const id = req.body.username;

		usersDB.deleteOne({ _id: id }).then((data) => {
			console.log(data);
			res.status(200).send({ msg: 'Account successfully deleted' });
		});
	});

	app.listen(port, () => {
		console.log(`Listening on ${port}`);
	});
});
