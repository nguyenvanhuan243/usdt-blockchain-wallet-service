const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const connect = require('./database/conn.js');
const listener = require("./service/BlockchainListener.js")

require('dotenv').config();
const corsOptions = {
  origin: [ "http://localhost:3000", "https://bscexchange.finance", "http://localhost:3001" ],
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
const port = process.env.PORT || 3000;
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let routes = require("./api/routes"); //importing route
routes(app);

app.use(function (req, res) {
  res.status(404).send({ url: req.originalUrl + " not found" });
});

connect().then(() => {
	try {
    app.listen(port, () => console.log(`Server connected to http://localhost:${port}`))
    listener.startBlockchainListener // Start blockchain listener
	} catch (error) { console.log('Cannot connect to the server')}
}).catch(error => {
	console.log("Invalid: Plz update database access: https://cloud.mongodb.com/v2/669b33db85326633803d313b#/security/network/accessList")
})


