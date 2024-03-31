// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transfer(
        address recipient,
        uint256 amount
    ) external returns (bool);
}

contract Airdrop {
    address public owner;
    IERC20 public token;

    constructor(address tokenAddress) {
        owner = msg.sender;
        token = IERC20(tokenAddress); // 设置代币合约地址
    }

    // 确保只有合约所有者可以调用此函数
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    // 执行空投
    function distributeTokens(
        address[] calldata recipients,
        uint256 amount
    ) external onlyOwner {
        for (uint i = 0; i < recipients.length; i++) {
            token.transfer(recipients[i], amount);
        }
    }
}
