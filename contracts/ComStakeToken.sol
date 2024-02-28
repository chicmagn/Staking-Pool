// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ComStakeToken is ERC20, Ownable {
    constructor() ERC20("CommuneAI Stake Token", "comaiST") {}

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}