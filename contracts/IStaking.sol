// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

interface IStaking {
    event TokensStaked(address indexed staker, uint256 amount);
    event TokensWithdrawn(address indexed staker, uint256 amount);
    event RewardsClaimed(address indexed staker, uint256 rewardAmount);
    event UpdatedTimeUint(uint256 oldTimeUnit, uint256 newTimeUnit);
    event UpdatedRewardRatio(uint256 oldNumerator, uint256 newNumerator, uint256 oldDenominator, uint256 newDenominator);
    event UpdatedMinStakeAmount(uint256 oldAmount, uint256 newAmount);

    struct Staker {
        uint128 timeOfLastUpdate;
        uint256 amountStaked;
        uint256 unclaimedRewards;
    }

    function stake(uint256 amount) external payable;
    function withdraw(uint256 amount) external;
    function claimRewards() external;
    function getStakeInfo(address staker) external view returns(uint256 _tokensStaked, uint256 _rewards);
}