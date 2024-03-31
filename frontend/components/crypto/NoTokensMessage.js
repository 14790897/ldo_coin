import React from "react";

export function NoTokensMessage({ selectedAddress }) {
  const isTesting = process.env.NEXT_PUBLIC_DEV === "true";
  return (
    <>
      <p>You don't have tokens，请完成已有的任务或者等待合约持有者的空投</p>
      {isTesting && (
        <p>
          To get some tokens, open a terminal in the root of the repository and
          run:
          <br />
          <code>npx hardhat --network localhost faucet {selectedAddress}</code>
        </p>
      )}
    </>
  );
}
