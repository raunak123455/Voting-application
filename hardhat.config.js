require("dotenv").config();
require("@nomiclabs/hardhat-waffle");

// rest of imports omitted

const GOERLI_RPC_URL = process.env.API_URL;
const PRIVATEKEY = process.env.PRIVATE_KEY;

module.exports = {
  solidity: {
    version: "0.8.0",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    goerli: {
      url: GOERLI_RPC_URL,
      accounts: [PRIVATEKEY], // TODO: fill the private key
    },
  },
  // ...rest omitted
};
