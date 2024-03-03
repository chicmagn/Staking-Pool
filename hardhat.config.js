require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: 'mumbai',
  networks: {
    mumbai: {
      // url: "https://polygon-mumbai.g.alchemy.com/v2/GJO0rvsoPVaTN58SP1JDV9Gw_jcCM8tK",
      url: 'https://endpoints.omniatech.io/v1/matic/mumbai/public',
      accounts: ['0xea72f1a3c53fce4690a6484cc4f6bf66fbe3088fd2590e7c97e177a0f8933e8a']
    }
  },
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  sourcify: {
    enabled: true
  },
  etherscan: {
    
    apiKey: "NEAKP8CSYHD3Y7F8P5UHU44J87E9A5FNCV"
  }
};
