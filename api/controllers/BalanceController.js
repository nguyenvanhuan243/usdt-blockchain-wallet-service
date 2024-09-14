"use strict";
const config = require("../../config");
const { ethers } = require("ethers");
module.exports = {
  getBalanceOfUSDT: async (req, res) => {
    const providerWeb3 = await config.checkMainNetURL;
    const balanceUSDT = await providerWeb3.tokenContract.balanceOf(req.params.address);
    const balanceBNB = await providerWeb3.providerFromBSC.getBalance(req.params.address);
    res.json({
      balanceUSDT: ethers.formatEther(balanceUSDT),
      balanceBNB: ethers.formatEther(balanceBNB).substring(0, 6),
    }); // (balanceUSDT / 10n ** 18n).toString()
  },

};
