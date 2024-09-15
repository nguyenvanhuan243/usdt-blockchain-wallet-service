require('dotenv').config();
const config = require("../config");
const axios = require("axios");
const AssetModel = require('../model/Asset.model.js')


function shouldCallApi(from, to, transactionInfos) {
    console.log("Checking call api #########################")
    if (AssetModel.find({ $or: [{ address: from }, { address: to }] }, function (err, data) {
        if (data.length > 0) {
            axios.post(`${process.env.BACKEND_API_BASE_URL}/api/v1/bscexchange_finance/payments`, transactionInfos, {
                headers: { 'Content-Type': 'application/json' }
            }).then(
                response => { console.log('Response:', response.data) }).catch(error => { }
                );

            axios.post(`${process.env.BACKEND_API_BASE_URL}/api/v1/bscexchange_finance/payments/network_confirmed`, transactionInfos, {
                headers: { 'Content-Type': 'application/json' }
            }).then(response => { console.log('Response:', response.data) }).catch(error => { });
        }
    }));
}

async function startBlockchainListener() {
    console.log("########################################## Started Blockchain Listener")
    const contract = await config.getTokenContract;
    console.log("Contract ##############", contract)
    contract.on('Transfer', (from, to, value, event) => {
        const transactionInfos = {
            from: from,
            to: to,
            value: value.toString(),
            transactionHash: event.log.transactionHash
        };
        shouldCallApi(from, to, transactionInfos)
    });
}

module.exports = {
    startBlockchainListener: startBlockchainListener()
};

// Listen to Smart Contact Events with Moralis: https://moralis.io/how-to-listen-to-smart-contract-events-using-ethers-js/