import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  // networks: {
  //   rinkeby: {
  //     url: "https://rinkeby.infura.io/v3/YOUR-PROJECT-ID",
  //     accounts: ["YOUR-PRIVATE-KEY"],
  //   },
  // },
};

export default config;
