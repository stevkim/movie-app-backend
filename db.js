const { MongoClient } = require('mongodb');

require('dotenv').config();

const client = new MongoClient(process.env.URI);

let db;
const MongoDb = {
	connect: (func) => {
		client.connect()
    .then(() => {
			db = client.db('movie-project');
			console.log('Mongo Connection Successful');
			return func();
		});
	},
	database: () => db
};

module.exports = MongoDb;