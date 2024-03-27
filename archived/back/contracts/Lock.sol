// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
import "hardhat/console.sol";

// interface IERC20 {
//     function totalSupply() external view returns (uint256);
//     function balanceOf(address account) external view returns (uint256);
//     function transfer(
//         address recipient,
//         uint256 amount
//     ) external returns (bool);
//     function allowance(
//         address owner,
//         address spender
//     ) external view returns (uint256);
//     function approve(address spender, uint256 amount) external returns (bool);
//     function transferFrom(
//         address sender,
//         address recipient,
//         uint256 amount
//     ) external returns (bool);

//     event Transfer(address indexed from, address indexed to, uint256 value);
//     event Approval(
//         address indexed owner,
//         address indexed spender,
//         uint256 value
//     );
// }
// contract LinuxDoToken is IERC20 {
//     string public constant name = "LinuxDoToken";
//     string public constant symbol = "LDO";
//     uint8 public constant decimals = 18;

//     mapping(address => uint256) balances;
//     mapping(address => mapping(address => uint256)) allowed;
//     uint256 totalSupply_ = 1000000 * 10 ** uint(decimals);

//     constructor() {
//         balances[msg.sender] = totalSupply_;
//     }

//     function totalSupply() public view override returns (uint256) {
//         return totalSupply_;
//     }

//     function balanceOf(
//         address tokenOwner
//     ) public view override returns (uint256) {
//         return balances[tokenOwner];
//     }

//     function transfer(
//         address receiver,
//         uint256 numTokens
//     ) public override returns (bool) {
//         require(numTokens <= balances[msg.sender]);
//         balances[msg.sender] = balances[msg.sender] - numTokens;
//         balances[receiver] = balances[receiver] + numTokens;
//         emit Transfer(msg.sender, receiver, numTokens);
//         return true;
//     }
//     function approve(
//         address delegate,
//         uint256 numTokens
//     ) public override returns (bool) {
//         allowed[msg.sender][delegate] = numTokens;
//         emit Approval(msg.sender, delegate, numTokens);
//         return true;
//     }

//     function allowance(
//         address owner,
//         address delegate
//     ) public view override returns (uint) {
//         return allowed[owner][delegate];
//     }

//     function transferFrom(
//         address owner,
//         address buyer,
//         uint256 numTokens
//     ) public override returns (bool) {
//         require(numTokens <= balances[owner]);
//         require(numTokens <= allowed[owner][msg.sender]);

//         balances[owner] = balances[owner] - numTokens;
//         allowed[owner][msg.sender] = allowed[owner][msg.sender] - numTokens;
//         balances[buyer] = balances[buyer] + numTokens;
//         emit Transfer(owner, buyer, numTokens);
//         return true;
//     }
// }
contract Lock {
    uint public unlockTime;
    address payable public owner;

    event Withdrawal(uint amount, uint when);

    constructor(uint _unlockTime) payable {
        require(
            block.timestamp < _unlockTime,
            "Unlock time should be in the future"
        );

        unlockTime = _unlockTime;
        owner = payable(msg.sender);
    }

    function withdraw() public {
        // Uncomment this line, and the import of "hardhat/console.sol", to print a log in your terminal
        // console.log("Unlock time is %o and block timestamp is %o", unlockTime, block.timestamp);

        require(block.timestamp >= unlockTime, "You can't withdraw yet");
        require(msg.sender == owner, "You aren't the owner");

        emit Withdrawal(address(this).balance, block.timestamp);

        owner.transfer(address(this).balance);
    }
}
