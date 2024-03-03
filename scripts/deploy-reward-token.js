const hre = require("hardhat");

async function main() {
    const rewardToken = await hre.ethers.deployContract("RewardToken");
    await rewardToken.waitForDeployment();
    console.log('Reward Token deployed');
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  