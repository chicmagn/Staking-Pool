# Staking Contract for Commune Staking DApp

# Compile

npx hardhat compile

# Deploy

npx hardhat run scripts/deploy-stake-token.js
npx hardhat run scripts/deploy-reward-token.js
npx hardhat run scripts/deploy-staking.js

# Verify

npx hardhat verify --contract contracts/StakeToken.sol:StakeToken 0x4d1aB348a5a5073baF991602c11FAa389e59E7aa
npx hardhat verify --contract contracts/RewardToken.sol:RewardToken 0xBee5859A4020dd30b0c4801d8045b5709Fc84ab9
npx hardhat verify --contract contracts/ComStaking.sol:ComStaking --constructor-args scripts/arg-staking.js 0x462e08EC11Fbb481BA0adB3840B1B38934fD1F81