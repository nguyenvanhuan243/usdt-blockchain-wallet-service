const mongoose = require('mongoose');

async function connect() {
	mongoose.set('strictQuery', true);
	const db = await mongoose.connect(process.env.ATLAS_URI);
	console.log("Database Connected");
	return db;
}

module.exports = connect;
