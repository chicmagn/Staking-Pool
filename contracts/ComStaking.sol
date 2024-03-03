// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

contract ComStaking is Ownable, Pausable, ReentrancyGuard {
    
    struct Staker {
        uint128 timeOfLastUpdate;
        uint256 amountStaked;
        uint256 unclaimedRewards;
    }

    address public immutable stakingToken;
    address public immutable rewardToken;
    uint256 public stakingTokenBalance;
    uint256 public rewardTokenBalance;
    address[] public stakersArray;
    mapping(address=> Staker) public stakers;

    constructor(
        address _stakingToken,
        address _rewardToken
    ) Ownable(msg.sender) {
        require (_rewardToken != _stakingToken, "Reward Token and Staking Token can't be the same.");
        rewardToken = _rewardToken;
        stakingToken = _stakingToken;
    }

    function stake(uint256 _amount) external nonReentrant {
        _stake(_amount);
    }

    function withdraw(uint256 _amount) external nonReentrant {
        _withdraw(_amount);
    }

    function claimRewards() external nonReentrant {
        _claimRewards();
    }

    function getStakeInfo(address _staker) external view returns (uint256 _tokensStaked, uint256 _rewards) {
        _tokensStaked = stakers[_staker].amountStaked;
        _rewards = _availableRewards(_staker);
    }

    function _stake(uint256 _amount) internal {
        require(_amount > 0, "Staking 0 tokens");

        if (stakers[msg.sender].amountStaked > 0) {
            _updateUnclaimedRewards(msg.sender);
        } else {
            stakersArray.push(msg.sender);
            stakers[msg.sender].timeOfLastUpdate = uint80(block.timestamp);
        }

        IERC20(stakingToken).approve(address(this), _amount);
        IERC20(stakingToken).transferFrom(msg.sender, address(this), _amount);
        stakers[msg.sender].amountStaked += _amount;
        stakingTokenBalance += _amount;

        emit TokensStaked(msg.sender, _amount);
    }

    function _withdraw(uint256 _amount) internal {
        uint256 amountStaked = stakers[msg.sender].amountStaked;
        require(_amount > 0, "Withdrawing 0 tokens");
        require(amountStaked >= _amount, "Withdrawing more than staked.");

        _updateUnclaimedRewards(msg.sender);

        if (amountStaked == _amount) {
            address[] memory _stakersArray = stakersArray;
            for(uint256 i = 0; i < _stakersArray.length; i++) {
                if (_stakersArray[i] == msg.sender) {
                    stakersArray[i] = _stakersArray[_stakersArray.length - 1];
                    stakersArray.pop();
                    break;
                }
            }
        }

        stakers[msg.sender].amountStaked -= _amount;
        stakingTokenBalance -= _amount;
        IERC20(stakingToken).approve(msg.sender, _amount);
        IERC20(stakingToken).transferFrom(address(this), msg.sender, _amount);

        emit TokensWithdrawn(msg.sender, _amount);
    }

    function _depositRewardTokens(uint256 _amount) external {
        require(msg.sender == owner(), "Not authorized");
        IERC20(rewardToken).approve( address(this), _amount);
        IERC20(rewardToken).transferFrom(msg.sender, address(this), _amount);
        rewardTokenBalance += _amount;
    }

    function _withdrawRewardTokens(uint256 _amount) external {
        require(msg.sender == owner(), "Not authorized");
        rewardTokenBalance = _amount > rewardTokenBalance ? 0 : rewardTokenBalance - _amount;
        IERC20(rewardToken).approve(msg.sender, _amount);
        IERC20(rewardToken).transferFrom(address(this), msg.sender, _amount);
    }

    function _claimRewards() internal {
        uint256 rewards = stakers[msg.sender].unclaimedRewards + _calculateRewards(msg.sender);
        require(rewards > 0, "No rewards!");

        stakers[msg.sender].unclaimedRewards = 0;
        
        _mintRewards(msg.sender, rewards);

        emit RewardsClaimed(msg.sender, rewards);
    }

    function _availableRewards(address _staker) internal view returns (uint256 _rewards) {
        if (stakers[_staker].amountStaked == 0) {
            _rewards = stakers[_staker].unclaimedRewards;
        } else {
            _rewards = stakers[_staker].unclaimedRewards + _calculateRewards(_staker);
        }
    }

    function _updateUnclaimedRewards(address _staker) internal {
        uint256 rewards = _calculateRewards(_staker);
        stakers[_staker].unclaimedRewards += rewards;
        stakers[_staker].timeOfLastUpdate = uint80(block.timestamp);
    }

    function _calculateRewards(address _staker) internal view returns(uint256 _rewards) {
        Staker memory staker = stakers[_staker];
        uint256 startTime = staker.timeOfLastUpdate;
        uint256 endTime = block.timestamp;
        uint256 timeElapsed = endTime - startTime;
        (, _rewards) = Math.tryDiv(timeElapsed * staker.amountStaked, 60 * 100);
        (, _rewards) = Math.tryMul(_rewards, 10 ** 18);

        _rewards /= (10 ** 18);
    }

    function _mintRewards(address _staker, uint256 _rewards) internal {
        require(_rewards <= rewardTokenBalance, "Not enough reward tokens");
        rewardTokenBalance -= _rewards;

        IERC20(rewardToken).approve(_staker, _rewards);
        IERC20(rewardToken).transferFrom(address(this), _staker, _rewards);
    }

    function getRewardTokenBalance() external view returns(uint256) {
        return rewardTokenBalance;
    }

    event TokensStaked(address indexed staker, uint256 amount);
    event TokensWithdrawn(address indexed staker, uint256 amount);
    event RewardsClaimed(address indexed staker, uint256 rewardAmount);
    event UpdatedTimeUint(uint256 oldTimeUnit, uint256 newTimeUnit);
    event UpdatedRewardRatio(uint256 oldNumerator, uint256 newNumerator, uint256 oldDenominator, uint256 newDenominator);
    event UpdatedMinStakeAmount(uint256 oldAmount, uint256 newAmount);
}