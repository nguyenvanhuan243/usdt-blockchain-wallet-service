"use strict";
const axios = require("axios");
const config = require("../../config");
const { ethers } = require("ethers");
var interValTimeOut;
module.exports = {
  tranferUSDT: async (req, res) => {
    try {
      const providerWeb3 = await config.checkMainNetURL;

      const requestData = {
        private_token: process.env.PRIVATE_TOKEN,
        private_key_encoded: req.query.privateKeyOfSender,
      };
      //let privateKeyAddress = '0xa3589a0c507baa0c60cf4f76c5e721f7a14268552a098e50c7e7242463709271';
      let privateKeyAddress = "";
      await axios
        .post(`${process.env.BACKEND_API_BASE_URL}/api/v1/bscexchange_finance/blockchains/decode_private_key`, requestData, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          privateKeyAddress = response.data.private_key;
          console.log("Response:", response.data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      console.log(privateKeyAddress);
      let wallet = new ethers.Wallet(
        privateKeyAddress,
        providerWeb3.providerFromBSC
      );

      const amount = BigInt(req.query.amount.toString()) * 10n ** 18n;
      let recipientAddress = req.query.toAddress;
      console.log(amount, recipientAddress, wallet.address);
      const approvalTx = await providerWeb3.tokenContract
        .connect(wallet)
        .transfer(recipientAddress, amount);
      console.log(approvalTx.hash);
      interValTimeOut = setInterval(
        () => ConfirmationTransaction(approvalTx.hash),
        2000
      );
      res.json({ result: "ok", transactionHash: approvalTx.hash });
    } catch (error) {
      console.log(error);
      res.json({ FailedtotransferUSDT: error });
    }
  },
};

async function ConfirmationTransaction(transactionHash) {
  const providerWeb3 = await config.checkMainNetURL;
  const transaction = await providerWeb3.providerFromBSC.getTransactionReceipt(
    transactionHash
  );
  console.log(transaction);
  if (transaction?.status === 1) {
    NotifyMe();
  }
}

function NotifyMe() {
  console.log("Token Sent Successfully");
  clearInterval(interValTimeOut);
}
