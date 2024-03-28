// ==UserScript==
// @name         Your Script Name
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://*/*
// @grant        none
// @require      https://cdn.ethers.io/lib/ethers-5.0.umd.min.js
// ==/UserScript==
(async function () {
  "use strict";

  // 检查以太坊提供者是否存在
  if (typeof window.ethereum !== "undefined") {
    // 请求用户连接钱包
    await window.ethereum.request({ method: "eth_requestAccounts" });

    // 创建一个新的以太坊提供者
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    // 使用提供者进行操作，例如读取账户余额
    const signer = provider.getSigner();
    const balance = await signer.getBalance();
    console.log(ethers.utils.formatEther(balance), "ETH");
  } else {
    console.error("Ethereum provider not found");
  }
})();
