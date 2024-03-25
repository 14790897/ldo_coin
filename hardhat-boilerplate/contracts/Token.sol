//SPDX-License-Identifier: UNLICENSED

// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.8.9;

// We import this library to be able to use console.log
import "hardhat/console.sol";

// This is the main building block for smart contracts.
contract Token {
    // Some string type variables to identify the token.
    string public name = "My Hardhat Token";
    string public symbol = "MHT";

    // The fixed amount of tokens stored in an unsigned integer type variable.
    uint256 public totalSupply = 1000000;

    // An address type variable is used to store ethereum accounts.
    address public owner;

    // A mapping is a key/value map. Here we store each account balance.
    mapping(address => uint256) balances;

    // The Transfer event helps off-chain aplications understand
    // what happens within your contract.
    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    /**
     * Contract initialization.
     */
    constructor() {
        // The totalSupply is assigned to the transaction sender, which is the
        // account that is deploying the contract.
        balances[msg.sender] = totalSupply;
        owner = msg.sender;
    }

    /**
     * A function to transfer tokens.
     *
     * The `external` modifier makes a function *only* callable from outside
     * the contract.
     */
    function transfer(address to, uint256 amount) external {
        // Check if the transaction sender has enough tokens.
        // If `require`'s first argument evaluates to `false` then the
        // transaction will revert.
        require(balances[msg.sender] >= amount, "Not enough tokens");

        // We can print messages and values using console.log, a feature of
        // Hardhat Network:
        console.log(
            "Transferring from %s to %s %s tokens",
            msg.sender,
            to,
            amount
        );

        // Transfer the amount.
        balances[msg.sender] -= amount;
        balances[to] += amount;

        // Notify off-chain applications of the transfer.
        emit Transfer(msg.sender, to, amount);
    }

    /**
     * Read only function to retrieve the token balance of a given account.
     *
     * The `view` modifier indicates that it doesn't modify the contract's
     * state, which allows us to call it without executing a transaction.
     */
    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }

    // 定义一个结构体来表示悬赏任务
    struct Task {
        string title;
        string description;
        uint256 reward;
        bool completed;
        uint256 id;
    }

    // 定义一个映射来存储每个用户的悬赏任务
    mapping(address => Task[]) public userTasks;

    uint256 private taskIdCounter = 0;

    function addTask(string memory title, string memory description) public {
        // 创建一个新的任务
        Task memory newTask = Task(title, description, 1, false, taskIdCounter);
        // 将任务添加到调用者的任务列表中

        userTasks[msg.sender].push(newTask);
        taskIdCounter++;
    }

    function completeTask(uint256 taskId) public {
        // 确保任务存在
        require(taskId < userTasks[msg.sender].length, "Task does not exist");
        // 确保任务未完成
        require(
            !userTasks[msg.sender][taskId].completed,
            "Task already completed"
        );
        // 将任务标记为已完成
        userTasks[msg.sender][taskId].completed = true;
        // 奖励调用者
        balances[msg.sender] += userTasks[msg.sender][taskId].reward;
    }
}
