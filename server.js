const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const connect = require('./database/conn.js');
const AssetModel = require('./model/Asset.model.js')
const config = require("./config");

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

const contract = config.getTokenContract;
contract.on('Transfer', (from, to, value, event) => {
  const transactionInfos = {
    from: from,
    to: to,
    value: value.toString(),
    transactionHash: event.log.transactionHash
  };
  if (AssetModel.find({ $or: [{ address: from }, { address: to }]}, function (err, data) {
    if (data.length > 0) {
      console.log("Data #####", data)
      axios.post(`${process.env.BACKEND_API_BASE_URL}/api/v1/bscexchange_finance/payments`, transactionInfos, {
        headers: { 'Content-Type': 'application/json' }
      }).then(response => { console.log('Response:', response.data) }).catch(error => { });
      
      axios.post(`${process.env.BACKEND_API_BASE_URL}/api/v1/bscexchange_finance/payments/network_confirmed`, transactionInfos, {
        headers: { 'Content-Type': 'application/json' }
      }).then(response => { console.log('Response:', response.data) }).catch(error => { });
    }
  }));
});

connect().then(() => {
	try {
		app.listen(port, () => console.log(`Server connected to http://localhost:${port}`))
	} catch (error) { console.log('Cannot connect to the server')}
}).catch(error => {
	console.log("Invalid: Plz update database access: https://cloud.mongodb.com/v2/669b33db85326633803d313b#/security/network/accessList")
})


