"use strict";
const config = require("../../config");
const { ethers } = require("ethers");
var interValTimeOut;
module.exports = {
  tranferUSDTWithPrivateKey: async (req, res) => {
    try {
      // Get params
      const privateKeyAddress = req.query.privateKeyOfSender;
      const recipientAddress = req.query.toAddress;

      // Web3
      const providerWeb3 = await config.checkMainNetURL;
      const wallet = new ethers.Wallet(
        privateKeyAddress,
        providerWeb3.providerFromBSC
      );

      const amount = BigInt(req.query.amount.toString()) * 10n ** 18n;
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
