// Listen to Smart Contact Events with Moralis
const Moralis = require("moralis").default;
const Chains = require("@moralisweb3/common-evm-utils");
const EvmChain = Chains.EvmChain;
const ABI = require("./abi.json");
require("dotenv").config();

const options = {
    chains: [EvmChain.ETHEREUM],
    description: "USDT Transfers 100k",
    tag: "usdcTransfers100k",
    includeContractLogs: true,
    abi: ABI,
    topic0: ["Transfer(address,address,uint256)"],
    webhookUrl: "https://22be-2001-2003-f58b-b400-f167-f427-d7a8-f84e.ngrok.io/webhook",
    advancedOptions: [
        {
            topic0: "Transfer(address,address,uint256)",
            filter: {
                gt: ["value", "100000" + "".padEnd(6, "0")]
            }
        }
    ]

};

Moralis.start({
    apiKey: process.env.MORALIS_KEY,
}).then(async () => {
    const stream = await Moralis.Streams.add(options);
    const { id } = stream.toJSON();

    await Moralis.Streams.addAddress({
        id: id,
        address: ["0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"]
    })
});
