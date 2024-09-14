"use strict";
const { ethers } = require("ethers");
module.exports = {
    getNewWallet: async (req, res) => {
        let wallet = ethers.Wallet.createRandom();
        res.json({
            address: wallet.address,
            private: wallet.privateKey,
            publickey: wallet.publicKey,
        });
    }
}
