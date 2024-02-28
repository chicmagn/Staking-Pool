// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./ComRewardToken.sol";
import "./ComStakeToken.sol";

import "./libs/PriceConverter.sol";

contract CommuneStaking is Ownable, Pausable, ReentrancyGuard {

    using PriceConverter for uint256;

    IERC20 public stakeToken;
    IERC20 public rewardToken;

    mapping(address=> uint256) public stakedAmount;
    mapping(address=> uint256) public lastStakedTime;

    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);

    constructor(address _stakeToken, address _rewardToken) {
        stakeToken = _stakeToken;
        rewardToken = _rewardToken;
    }

    function stake(uint256 amount) external{
        require(amount > 0, "The amount must be greater than 0");
        require(stakeToken.balanceOf(msg.sender) >= amount, "Insufficient balance");
        require(stakeToken.allowance(msg.sender, address(this))>= amount, "Insufficient allowance");

        if (stakedAmount[msg.sender] == 0) {
            lastStakedTime[msg.sender] = block.timestamp;
        }

        stakeToken.transferFrom(msg.sender, address(this), amount);
        stakedAmount[msg.sender] += amount;

        emit Staked(msg.sender, amount);
    }

    function withdraw(uint256 amount) external {
        require(amount > 0, "Withdrawal amount must be greater than 0");
        require(stakedAmount[msg.sender] >= amount, "Insufficient staked amount");

        uint256 reward = getReward(msg.sender);
        if (reward > 0) {
            rewardToken.mint(msg.sender, reward);
            emit RewardPaid(msg.sender, reward);
        }

        stakedAmount[msg.sender] -= amount;
        stakeToken.transfer(msg.sender, amount);

        emit Withdrawn(msg.sender, amount);
    }

    function getReward(address user) public view returns(uint256) {
        uint256 timeElapsed = block.timestamp - lastStakedTime[user];
        uint256 stakedAmountOfUser = stakedAmount[user];

        if (timeElapsed == 0 || stakedAmountOfUser == 0) {
            return 0;
        }

        uint256 reward = stakedAmountOfUser * timeElapsed;

        return reward;
    }

    function getStakedBalance(address user) public view returns (uint256) {
        return stakedAmount[user];
    }

}