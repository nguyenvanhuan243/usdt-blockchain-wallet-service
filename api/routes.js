'use strict';
module.exports = function (app) {
  const blockchainCtrl = require('./controllers/BlockChainController');
  const healthServerController = require('./controllers/HealthServerController');
  const blockchainAddressController = require('./controllers/BlockChainAddressController');
  const balanceController = require('./controllers/BalanceController');
  const assetController = require('./controllers/AssetController');
  // let webHookCtrl = require('./controllers/WebHookController');
  const transferPrivateKeyController = require("./controllers/TransferPrivateKeyController")

  app.route('/')
    .get(healthServerController.getHealthServer)

  // Import usdt address
  app.route('/blockchain/importUsdtAddress')
    .post(assetController.importUsdtAddress)

  // Transfer usdt using private key address
  app.route('/blockchain/tranferUSDTWithPrivateKey')
    .post(transferPrivateKeyController.tranferUSDTWithPrivateKey)

  app.route('/blockchain/userAddresses')
    .get(assetController.userAddresses)

  // Create new address
  app.route('/blockchain/getNewWallet')
    .get(blockchainAddressController.getNewWallet)

  // get balance
  app.route('/blockchain/getBalanceOfUSDT/:address')
    .get(balanceController.getBalanceOfUSDT)

  // tranferUSDT
  app.route('/blockchain/tranferUSDT')
    .get(blockchainCtrl.tranferUSDT)

  // confirmTransactions
  // app.route('/webhook/confirmTransaction/:transactionHash')
  //   .get(webHookCtrl.confirmTransactions)
};
