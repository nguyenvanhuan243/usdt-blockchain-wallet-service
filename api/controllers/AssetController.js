"use strict";
const AssetModel = require('../../model/Asset.model.js');

module.exports = {
    importUsdtAddress: async (req, res) => {
        try {
            const user = req.body;
            const currentTime = new Date();
            console.log("#################################### Importing address at Time: ", currentTime);

            // Find if the address already exists
            const existingAddress = await AssetModel.findOne({
                user_id: user.user_id,
                address: user.address,
                symbol: "USDT"
            }).exec();

            if (!existingAddress) {
                // Address does not exist, so create and save a new one
                let address = new AssetModel({
                    user_id: user.user_id,
                    address: user.address,
                    symbol: "USDT"
                });

                await address.save();
                res.send({ message: "Imported OK" });
            } else {
                // Address already exists
                res.send({ message: "Existed" });
            }
        } catch (error) {
            console.error('Error occurred:', error);
            if (!res.headersSent) {
                res.status(500).send({ message: "Internal Server Error" });
            }
        }
    },
    userAddresses: async (req, res) => {
        try {
            const currentTime = new Date();
            console.log("#################################### Get address at Time: ", currentTime);
            const assets = await AssetModel.find({}).exec();
            res.send({ data: assets })
        } catch (error) {
            console.error('Error occurred:', error);
            if (!res.headersSent) {
                res.status(500).send({ message: "Internal Server Error" });
            }
        }
    }
};

// curl --location 'http://localhost:3000/blockchain/importUsdtAddress' \
// --header 'Content-Type: application/json' \
// --data '{
//     "address": "ssfdfsd434343dfdfasfdsfsafdsafdfdsfsafdsfasfdfafdsfd",
//     "user_id": 105,
//     "symbol": "USDT"
// }'



// Get addresses
// curl --location 'http://localhost:3000/blockchain/userAddresses'