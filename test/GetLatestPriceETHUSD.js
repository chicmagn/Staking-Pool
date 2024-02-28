// Ethereum Price Feed from Chainlink

Web3 = require('web3');

const infura_project_id = '';
const web3 = new Web3(`https://mainnet.infura.io/v3/${infura_project_id}`);
const aggregatorV3InterfaceABI = [];

// Mainnet
const addr = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419";
// Rinkeby
// const addr = "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e";
// Kovan
// const addr = "0x9326BFA02ADD2366b30bacB125260Af641031331";

const priceFeed = new web3.eth.Contract(aggregatorV3InterfaceABI, addr);

priceFeed.methods.decimals().call()
    .then((Decmials)=> {
        console.log(Decmials);
    });

priceFeed.methods.latestRoundData().call()
    .then((roundData) => {
        const priceData = roundData;
        ETHUSD = pricdData.answer;
        console.log("Latest Round Data", roundData);
        console.log("ETH/USD Price=", ETHUSD/10**8);
    });