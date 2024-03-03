const hre = require("hardhat");
async function main() {

    const COMMUNE_STAKE_TOKEN_ADDRESS = "0x4d1aB348a5a5073baF991602c11FAa389e59E7aa";
    const COMMUNE_REWARD_TOKEN_ADDRESS = "0xBee5859A4020dd30b0c4801d8045b5709Fc84ab9";
    // const comStakingInterface = await hre.ethers.deployContract("ComStaking", [COMMUNE_STAKE_TOKEN_ADDRESS, COMMUNE_REWARD_TOKEN_ADDRESS]);
    // await comStakingInterface.waitForDeployment();
    // console.log('Staking contract deployed');
    
    const ComStaking = await ethers.getContractFactory("ComStaking");
    const comStaking = await ComStaking.deploy(COMMUNE_STAKE_TOKEN_ADDRESS, COMMUNE_REWARD_TOKEN_ADDRESS);
    // await comStaking.deployed();
    // await comStaking.waitForDeployment();
    console.log('Staking contract deployed');
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  