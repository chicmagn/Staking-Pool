const hre = require("hardhat");

async function main() {
    const stakeToken = await hre.ethers.deployContract("StakeToken");
    await stakeToken.waitForDeployment();
    console.log('Stake Token deployed');
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  